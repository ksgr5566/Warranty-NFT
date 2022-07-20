// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

import "hardhat/console.sol";

contract WarrantyNFT is ReentrancyGuard {

    using SafeMath for uint256;

    event Transfer(address indexed _from, address indexed _to, uint256 indexed _tokenId);
    event Approval(address indexed _owner, address indexed _approved, uint256 indexed _tokenId);
    event ItemReplace(uint indexed _replacedTokenId, uint indexed _newTokenId);
    event ItemRepair(uint indexed _tokenId, string uri);

    string private _name = "Warranty-NFT";
    string private _symbol = "WARNT";

    struct Warranty {
        address creator;
        string itemSerialNumber;
        string uri;
        bool unlimitedTransfers;
        uint numOfTransfersAvailable;
        uint period;
        uint timestamp;
    }
   
    Warranty[] private _collection;

    mapping (uint => address) private _warrantyIdToOwner;
    mapping (address => uint) private _ownerWarrantyCount;
    mapping (address => uint[]) private _creatorToWarrantyIds;
    mapping (address => uint[]) private _retailerToWarrantyIds;
    mapping (uint => address) private _warrantyIdToApprovedAddress;

    modifier onlyCreator (uint _tokenId) {
        require(msg.sender == _collection[_tokenId].creator,
                "Sender is not creator of the warranty!");
        _;
    }

    modifier onlyApproved(uint _tokenId) {
        require(msg.sender == _warrantyIdToApprovedAddress[_tokenId], 
                "Sender is not an approved retailer!");
        _;
    }

    modifier onlyCreatorOrApproved(uint _tokenId) {
        require(msg.sender == _collection[_tokenId].creator || isApprovedAddress(msg.sender, _tokenId),
                "Sender is neither the creator not the approved one for the warranty!");
        _;
    }

    modifier onlyValidToken(uint _tokenId) {
        require(!(_collection.length == 0) && _tokenId <= _collection.length.sub(1),
                "TokenId is non-existant!");
        _;
    }

    function isApprovedAddress(address _address, uint _tokenId) public view returns (bool) {
        return _address == _warrantyIdToApprovedAddress[_tokenId];
        
    }

    function getWarranty(uint _tokenId) external view returns (address, string memory, string memory, bool, uint, uint, uint) {
        Warranty storage warranty = _collection[_tokenId]; 
        return (warranty.creator, warranty.itemSerialNumber, warranty.uri, 
                warranty.unlimitedTransfers,
                warranty.numOfTransfersAvailable, warranty.period, warranty.timestamp);
    }

    function getApprovedAddress(uint _tokenId) external view returns (address) {
        return _warrantyIdToApprovedAddress[_tokenId];
    }

    function getOwner(uint256 _tokenId) external view returns (address) {
        return _warrantyIdToOwner[_tokenId];
    }

    function setTransfersAvailable(uint _tokenId, uint _transfers) external onlyCreator(_tokenId) {
        _collection[_tokenId].numOfTransfersAvailable = _transfers;
    }

    function name() external view returns (string memory) {
        return _name;
    }

    function symbol() external view returns (string memory) {
        return _symbol;
    }

    function mint(string memory _itemSerialNumber, string memory _uri, 
                  bool _unlimitedTransfers, 
                  uint _numOfTransfers, uint _period) 
                  public  nonReentrant returns (uint) {
        _collection.push(Warranty(msg.sender, _itemSerialNumber, _uri, _unlimitedTransfers, _numOfTransfers, _period, 0));
        uint id = _collection.length.sub(1);
        // console.log("Mint call id: '%d'", id);
        _creatorToWarrantyIds[msg.sender].push(id);
        // _warrantyIdToOwner[id] = msg.sender;
        // _ownerWarrantyCount[msg.sender] = _ownerWarrantyCount[msg.sender].add(1);
        emit Transfer(address(0), msg.sender, id);
        return id;
    }

    function transferTo(address _to, uint _tokenId) external {
        if (msg.sender == _collection[_tokenId].creator || isApprovedAddress(msg.sender, _tokenId)) {
            _collection[_tokenId].timestamp = block.timestamp;
            _transfer(_to, _tokenId);
        }
        else if (_warrantyIdToOwner[_tokenId] == msg.sender) {
            if(_collection[_tokenId].unlimitedTransfers) _transfer(_to, _tokenId);
            else {
                require(_collection[_tokenId].numOfTransfersAvailable >=1, "Transfers unavailable!");
                _collection[_tokenId].numOfTransfersAvailable = _collection[_tokenId].numOfTransfersAvailable.sub(1);
            }
        }
    }

    function _transfer(address _to, uint _tokenId) private onlyValidToken(_tokenId) {
        _warrantyIdToOwner[_tokenId] = _to;
        if(!isApprovedAddress(msg.sender, _tokenId) && !(msg.sender == _collection[_tokenId].creator)) {
            _ownerWarrantyCount[msg.sender] = _ownerWarrantyCount[msg.sender].sub(1);
        }
        _ownerWarrantyCount[_to] = _ownerWarrantyCount[_to].add(1);
        emit Transfer(msg.sender, _to, _tokenId);
    }

    function approve(address _approved, uint256 _tokenId) external onlyCreator(_tokenId) {
        _warrantyIdToApprovedAddress[_tokenId] = _approved;
        emit Approval(msg.sender, _approved, _tokenId);
    }

    function setTimestamp(uint _tokenId) external onlyCreatorOrApproved(_tokenId) {
        _collection[_tokenId].timestamp = block.timestamp;
    }

    function setPeriod(uint _tokenId, uint _period) external onlyCreatorOrApproved(_tokenId) {
        _collection[_tokenId].period = _period;
    }

    function isValidWarranty(uint _tokenId) public view onlyValidToken(_tokenId) returns (bool) {
        if (_warrantyIdToOwner[_tokenId] == address(0) || 
            (_collection[_tokenId].timestamp.add(_collection[_tokenId].period.mul(1 days)) > block.timestamp)
           ) return true;
        return false;
    }

    function decayWarranty(uint _tokenId) public onlyValidToken(_tokenId) onlyCreatorOrApproved(_tokenId) {
        require(!isValidWarranty(_tokenId));
        _transfer(address(0), _tokenId);
    }

    function getCollectionLength() external view returns (uint) {
        return _collection.length;
    }

    function itemRepair(uint _tokenId, string memory _uri) external onlyCreatorOrApproved(_tokenId) {
        emit ItemRepair(_tokenId, _uri);
    }

    function itemReplace(uint _prevTokenId, string memory _itemSerialNumber, string memory _uri, 
                         bool _unlimitedTransfers, 
                         uint _numOfTransfers, uint _period) onlyCreatorOrApproved(_prevTokenId) external {

        uint id = mint(_itemSerialNumber, _uri, _unlimitedTransfers, _numOfTransfers, _period);
        _transfer(_warrantyIdToOwner[_prevTokenId], id);
        _transfer(address(0), _prevTokenId);
        emit ItemReplace(_prevTokenId, id);
    }

}