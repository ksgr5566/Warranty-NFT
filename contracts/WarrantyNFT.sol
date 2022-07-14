// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract WarrantyNFT {

    using SafeMath for uint256;

    event Transfer(address indexed _from, address indexed _to, uint256 indexed _tokenId);
    event Approval(address indexed _owner, address indexed _approved, uint256 indexed _tokenId);

    string private _name = "WarrantyNFT";
    string private _symbol = "WARNT";

    struct Warranty {
        address creator;
        string itemSerialNumber;
        string uri;
        bool isCustomer;
        bool isSoulbound;
        bool unlimitedTransfers;
        uint numOfTransfersAvailable;
        uint period;
    }

    Warranty[] private _collection;

    mapping (uint => address) private _warrantyIdToOwner;
    mapping (address => uint) private _ownerWarrantyCount;
    mapping (address => uint[]) private _creatorToWarrantyIds;
    mapping (uint => address[]) private _warrantyIdToApprovedAddresses; 

    modifier onlyCreator (uint _tokenId) {
        require(msg.sender == getCreator(_tokenId));
        _;
    }

    function getCreator(uint _tokenId) public view returns(address) {
        return _collection[_tokenId].creator;
    }

    function isApprovedAddress(address _address, uint _tokenId) public view returns (bool) {
        for (uint i=0; i<_warrantyIdToApprovedAddresses[_tokenId].length; i.add(1)) {
            if (_address == _warrantyIdToApprovedAddresses[_tokenId][i]) return true;
        }
        return false;   
    }

    function isOwner(address _address, uint _tokenId) public view returns (bool) {
        if (_warrantyIdToOwner[_tokenId] == _address) return true;
        return false;
    }

    function isCreator(address _address, uint _tokenId) public view returns (bool) {
        if (_address == _collection[_tokenId].creator) return true;
        return false;
    }

    function isSoulbound(uint _tokenId) public view returns (bool) {
        if (_collection[_tokenId].isSoulbound) return true;
        return false;
    }

    function areTransfersUnlimited(uint _tokenId) public view returns (bool) {
        if (_collection[_tokenId].unlimitedTransfers) return true;
        return false;
    }

    function getAvailableTransfers(uint _tokenId) public view returns (uint) {
        return _collection[_tokenId].numOfTransfersAvailable;
    }

    function getOwner(uint256 _tokenId) public view returns (address) {
        return _warrantyIdToOwner[_tokenId];
    }

    function isValidTransfer(address _address, uint _tokenId) public view returns (bool) {
        if (isCreator(_address, _tokenId) ) return true;
        else if (isApprovedAddress(_address, _tokenId)) return true;
        else if (isOwner(_address, _tokenId) && (areTransfersUnlimited(_tokenId) || getAvailableTransfers(_tokenId) >=1)) return true;
        return false;
    }

    function setTransfersAvailable(uint _tokenId, uint _transfers) external onlyCreator(_tokenId) {
        _collection[_tokenId].numOfTransfersAvailable = _transfers;
    }

    function name() public view returns (string memory) {
        return _name;
    }

    function symbol() public view returns (string memory) {
        return _symbol;
    }

    function mint(string memory _itemSerialNumber, string memory _uri, 
                  bool _soulbound, bool _unlimitedTransfers, 
                  uint _numOfTransfers, uint _period) 
                  public {
        _collection.push(Warranty(msg.sender, _itemSerialNumber, _uri, false, _soulbound, _unlimitedTransfers, _numOfTransfers, _period));
        uint id = _collection.length - 1;
        _creatorToWarrantyIds[msg.sender].push(id);
        _warrantyIdToOwner[id] = msg.sender;
        _ownerWarrantyCount[msg.sender].add(1);
        emit Transfer(address(0), msg.sender, id);
    }

    function transferFrom(address _to, uint _tokenId) external {
        require(isValidTransfer(msg.sender, _tokenId));
        if(isOwner(msg.sender, _tokenId) && !areTransfersUnlimited(_tokenId)) {
            _collection[_tokenId].numOfTransfersAvailable.sub(1);
        }
        _warrantyIdToOwner[_tokenId] = _to;
        _ownerWarrantyCount[msg.sender].sub(1);
        _ownerWarrantyCount[_to].add(1);
        emit Transfer(msg.sender, _to, _tokenId);
    }

}