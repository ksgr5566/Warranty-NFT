// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "hardhat/console.sol";

contract WarrantyNFT {

    using SafeMath for uint256;

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    event Transfer(address indexed _from, address indexed _to, uint256 indexed _tokenId);
    event Approval(address indexed _creator, address indexed _approved, uint256 indexed _tokenId);
    event ItemReplace(uint indexed _replacedTokenId, uint indexed _newTokenId);
    event ItemRepair(uint indexed _tokenId, string uri);

    string private _name = "Warranty-NFT";
    string private _symbol = "WarNT";

    struct Warranty {
        address creator;
        string itemSerialNumber;
        string uri;
        bool unlimitedTransfers;
        uint numOfTransfersAvailable;
        uint period;
        uint timestamp;
    }
   
    mapping (uint => Warranty) public idToWarranty;
    mapping (uint => address) public warrantyIdToOwner;
    mapping (address => uint) public ownerWarrantyCount;
    mapping (address => uint[]) public creatorToWarrantyIds;
    mapping (uint => address) public warrantyIdToApprovedAddress;

    modifier onlyCreator (uint _tokenId) {
        require(msg.sender == idToWarranty[_tokenId].creator,
                "Sender is not creator of the warranty!");
        _;
    }

    modifier onlyApproved(uint _tokenId) {
        require(msg.sender == warrantyIdToApprovedAddress[_tokenId], 
                "Sender is not an approved retailer!");
        _;
    }

    modifier onlyCreatorOrApproved(uint _tokenId) {
        require(msg.sender == idToWarranty[_tokenId].creator || isApprovedAddress(msg.sender, _tokenId),
                "Sender is neither the creator not the approved one for the warranty!");
        _;
    }

    modifier onlyValidToken(uint _tokenId) {
        require(idToWarranty[_tokenId].creator != address(0), "TokenId is non-existant!");
        _;
    }

    function isApprovedAddress(address _address, uint _tokenId) public view returns (bool) {
        return _address == warrantyIdToApprovedAddress[_tokenId];
        
    }

    function setTransfersAvailable(uint _tokenId, uint _transfers) external onlyCreator(_tokenId) {
        idToWarranty[_tokenId].numOfTransfersAvailable = _transfers;
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
                  public returns (uint) {

        _tokenIds.increment();
        uint id = _tokenIds.current();

        idToWarranty[id] = Warranty(msg.sender, _itemSerialNumber, _uri, _unlimitedTransfers, _numOfTransfers, _period, 0);
        creatorToWarrantyIds[msg.sender].push(id);
        emit Transfer(address(0), msg.sender, id);
        return id;
    }

    struct mintInput {
        string itemSerialNumber;
        string uri;
        bool unlimitedTransfers;
        uint numOfTransfers;
        uint period;
    }

    function multipleMint (mintInput[] calldata input) external {
        for (uint i = 0; i < input.length; i++) {
            mint(input[i].itemSerialNumber, input[i].uri, input[i].unlimitedTransfers, input[i].numOfTransfers, input[i].period);
        }
    }

    function transferTo(address _to, uint _tokenId) external {
        if (msg.sender == idToWarranty[_tokenId].creator || isApprovedAddress(msg.sender, _tokenId)) {
            idToWarranty[_tokenId].timestamp = block.timestamp;
            _transfer(_to, _tokenId);
        }
        else if (warrantyIdToOwner[_tokenId] == msg.sender) {
            if(idToWarranty[_tokenId].unlimitedTransfers) _transfer(_to, _tokenId);
            else {
                require(idToWarranty[_tokenId].numOfTransfersAvailable >=1, "Transfers unavailable!");
                idToWarranty[_tokenId].numOfTransfersAvailable = idToWarranty[_tokenId].numOfTransfersAvailable.sub(1);
            }
        }
    }

    function _transfer(address _to, uint _tokenId) private onlyValidToken(_tokenId) {
        warrantyIdToOwner[_tokenId] = _to;
        if(!isApprovedAddress(msg.sender, _tokenId) && !(msg.sender == idToWarranty[_tokenId].creator)) {
            ownerWarrantyCount[msg.sender] = ownerWarrantyCount[msg.sender].sub(1);
        }
        ownerWarrantyCount[_to] = ownerWarrantyCount[_to].add(1);
        emit Transfer(msg.sender, _to, _tokenId);
    }

    function approve(address _approved, uint256 _tokenId) external onlyCreator(_tokenId) {
        warrantyIdToApprovedAddress[_tokenId] = _approved;
        emit Approval(msg.sender, _approved, _tokenId);
    }

    function setTimestamp(uint _tokenId) external onlyCreatorOrApproved(_tokenId) {
        idToWarranty[_tokenId].timestamp = block.timestamp;
    }

    function setPeriod(uint _tokenId, uint _period) external onlyCreatorOrApproved(_tokenId) {
        idToWarranty[_tokenId].period = _period;
    }

    function isValidWarranty(uint _tokenId) public view onlyValidToken(_tokenId) returns (bool) {
        if (warrantyIdToOwner[_tokenId] == address(0) || 
            (idToWarranty[_tokenId].timestamp.add(idToWarranty[_tokenId].period.mul(1 days)) > block.timestamp)
           ) return true;
        return false;
    }

    function decayWarranty(uint _tokenId) public onlyValidToken(_tokenId) onlyCreatorOrApproved(_tokenId) {
        require(!isValidWarranty(_tokenId));
        _transfer(address(0), _tokenId);
    }

    function itemRepair(uint _tokenId, string calldata _uri) external onlyCreatorOrApproved(_tokenId) {
        emit ItemRepair(_tokenId, _uri);
    }

    function itemReplace(uint _prevTokenId, string calldata _itemSerialNumber, string calldata _uri, 
                         bool _unlimitedTransfers, 
                         uint _numOfTransfers, uint _period) onlyCreatorOrApproved(_prevTokenId) external {

        uint id = mint(_itemSerialNumber, _uri, _unlimitedTransfers, _numOfTransfers, _period);
        _transfer(warrantyIdToOwner[_prevTokenId], id);
        _transfer(address(0), _prevTokenId);
        emit ItemReplace(_prevTokenId, id);
    }

}