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
        address currentOwner;
        string itemSerialNumber;
        string uri;
        bool unlimitedTransfers;
        uint numOfTransfersAvailable;
        uint period;
        uint timestamp;
    }
   
    mapping (uint => Warranty) public idToWarranty;
    mapping (address => uint[]) public ownerToIds;
    mapping (address => uint[]) public creatorToIds;
    mapping (uint => address) public idToApproved;

    function getOwnerIds(address _owner) external view returns (uint[] memory) {
        return ownerToIds[_owner];
    }

    function getCreatorIds(address _creator) external view returns (uint[] memory) {
        return creatorToIds[_creator];
    }

    modifier onlyCreator (uint _tokenId) {
        require(msg.sender == idToWarranty[_tokenId].creator,
                "Sender is not creator of the warranty!");
        _;
    }

    modifier onlyApproved(uint _tokenId) {
        require(msg.sender == idToApproved[_tokenId], 
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
        return _address == idToApproved[_tokenId];
        
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
        idToWarranty[id] = Warranty(msg.sender, address(0), _itemSerialNumber, _uri, _unlimitedTransfers, _numOfTransfers, _period, 0);
        creatorToIds[msg.sender].push(id);
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

    function transferTo(address _to, uint _tokenId) public {
        if (msg.sender == idToWarranty[_tokenId].creator || isApprovedAddress(msg.sender, _tokenId)) {
            require(idToWarranty[_tokenId].currentOwner == address(0), "Token is already owned!");
            idToWarranty[_tokenId].timestamp = block.timestamp;
            _transfer(_to, _tokenId);
        }
        else if (idToWarranty[_tokenId].currentOwner == msg.sender) {
            if(idToWarranty[_tokenId].unlimitedTransfers) _transfer(_to, _tokenId);
            else {
                require(idToWarranty[_tokenId].numOfTransfersAvailable >=1, "Transfers unavailable!");
                idToWarranty[_tokenId].numOfTransfersAvailable = idToWarranty[_tokenId].numOfTransfersAvailable.sub(1);
                _transfer(_to, _tokenId);
            }
        }
    }

    function _transfer(address _to, uint _tokenId) private onlyValidToken(_tokenId) {
        idToWarranty[_tokenId].currentOwner = _to;
        if(!isApprovedAddress(msg.sender, _tokenId) && !(msg.sender == idToWarranty[_tokenId].creator)) {
            for (uint i=0; i < ownerToIds[msg.sender].length; i++) {
                if (ownerToIds[msg.sender][i] == _tokenId) {
                    ownerToIds[msg.sender][i] = ownerToIds[msg.sender][ownerToIds[msg.sender].length - 1];
                    ownerToIds[msg.sender].pop();
                    break;
                }
            }
        }
        ownerToIds[_to].push(_tokenId);
        emit Transfer(msg.sender, _to, _tokenId);
    }

    function approve(address _approved, uint256 _tokenId) external onlyCreator(_tokenId) {
        idToApproved[_tokenId] = _approved;
        emit Approval(msg.sender, _approved, _tokenId);
    }

    function setTimestamp(uint _tokenId) external onlyCreatorOrApproved(_tokenId) {
        idToWarranty[_tokenId].timestamp = block.timestamp;
    }

    function setPeriod(uint _tokenId, uint _period) external onlyCreatorOrApproved(_tokenId) {
        idToWarranty[_tokenId].period = _period;
    }

    function isValidWarranty(uint _tokenId) public view onlyValidToken(_tokenId) returns (bool) {
        if (idToWarranty[_tokenId].currentOwner == address(0) || 
            (idToWarranty[_tokenId].timestamp.add(idToWarranty[_tokenId].period.mul(1 days)) > block.timestamp)
           ) return true;
        return false;
    }

    function decay(uint _tokenId) external onlyValidToken(_tokenId) onlyCreatorOrApproved(_tokenId) {
        require(!isValidWarranty(_tokenId));
        delete idToWarranty[_tokenId];
        delete idToApproved[_tokenId];
    }

    function itemRepair(uint _tokenId, string calldata _uri) external onlyCreatorOrApproved(_tokenId) {
        emit ItemRepair(_tokenId, _uri);
    }

    function itemReplace(uint _prevId, uint _newId) onlyCreatorOrApproved(_prevId) onlyCreatorOrApproved(_newId) external {
        transferTo(idToWarranty[_prevId].currentOwner, _newId);
        delete idToWarranty[_prevId];
        delete idToApproved[_prevId];
        emit ItemReplace(_prevId, _newId);
    }

}