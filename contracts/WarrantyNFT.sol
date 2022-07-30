// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title Implementation of Warranty Non-Fungible Token.
 * The proposed appraoch is specified here: https://github.com/ksgr5566/Warranty-NFT/blob/master/RULES.md
 * @notice This contract is a prototype of the proposed appraoch.
 */
contract WarrantyNFT {

    using SafeMath for uint256;

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    event Transfer(address indexed _from, address indexed _to, uint256 indexed _tokenId);
    event Approval(address indexed _creator, address indexed _approved, uint256 indexed _tokenId);
    event ItemReplace(uint indexed _replacedTokenId, uint indexed _newTokenId);
    event ItemRepair(uint indexed _tokenId, string uri);

    // Token Name and Symbol
    string private _name = "Warranty-NFT";
    string private _symbol = "WarNT";

    // Token properties
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
   
    // Mapping from token ID to Warranty struct
    mapping (uint => Warranty) public idToWarranty;

    // Mapping an address to list of that address's owned token ids
    mapping (address => uint[]) public ownerToIds;

    // Mapping an address to list of that address's created token ids
    mapping (address => uint[]) public creatorToIds;

    // Mapping from token ID to its approved address
    mapping (uint => address) public idToApproved;


    /**
     * @notice Gets the owned ids of an address 
     */
    function getOwnerIds(address _owner) external view returns (uint[] memory) {
        return ownerToIds[_owner];
    }

    /**
     * @notice Gets the created ids of an address 
     */
    function getCreatorIds(address _creator) external view returns (uint[] memory) {
        return creatorToIds[_creator];
    }

    /**
     * @notice Gets the created ids of an address 
     */
    modifier onlyCreator (uint _tokenId) {
        require(msg.sender == idToWarranty[_tokenId].creator,
                "Sender is not creator of the warranty!");
        _;
    }

    /**
     * @notice Checks if the message sender is an approved address of the token. 
     */
    modifier onlyApproved(uint _tokenId) {
        require(msg.sender == idToApproved[_tokenId], 
                "Sender is not an approved retailer!");
        _;
    }

    /**
     * @notice Checks if the message sender is either the creator or an 
     * approved address of the token. 
     */
    modifier onlyCreatorOrApproved(uint _tokenId) {
        require(msg.sender == idToWarranty[_tokenId].creator || isApprovedAddress(msg.sender, _tokenId),
                "Sender is neither the creator not the approved one for the warranty!");
        _;
    }

    /**
     * @notice Checks if the given id represents a valid token.
     * @dev If the creator address is default value, i.e., address(0) the token has either been 
     * decayed or has not been created yet.
     */
    modifier onlyValidToken(uint _tokenId) {
        require(idToWarranty[_tokenId].creator != address(0), "TokenId is non-existant!");
        _;
    }

    /**
     * @notice Checks if the given address is an approved address of the token id.
     */
    function isApprovedAddress(address _address, uint _tokenId) public view returns (bool) {
        return _address == idToApproved[_tokenId];
        
    }

    /**
     * @notice Allows the creator to set the transfers available property of the warranty struct.
     * This is helpful in case of an extension of warranty.
     */
    function setTransfersAvailable(uint _tokenId, uint _transfers) external onlyCreator(_tokenId) {
        idToWarranty[_tokenId].numOfTransfersAvailable = _transfers;
    }

    function name() external view returns (string memory) {
        return _name;
    }

    function symbol() external view returns (string memory) {
        return _symbol;
    }

    /**
     * @notice Creates a new warranty token.
     * @param _itemSerialNumber The serial number of the item.
     * @param _uri The IPFS URI of the terms and contditions of the item.
     * @param _unlimitedTransfers Whether the warranty can be transferred unlimited times.
     * @param _numOfTransfers The allowed number of transfers for the warranty.
     * @param _period The number of days the warranty is valid since ownership.
     * @return The token id of the newly created warranty.
     * @dev The creator of the warranty is the sender of the transaction and 
     * the Transfer event is emitted upon successful creation.
     */
    function mint(
        string memory _itemSerialNumber,
        string memory _uri,
        bool _unlimitedTransfers,
        uint _numOfTransfers,
        uint _period
    ) public returns (uint) {
        _tokenIds.increment();
        uint id = _tokenIds.current();
        idToWarranty[id] = Warranty(
            msg.sender,
            address(0),
            _itemSerialNumber,
            _uri,
            _unlimitedTransfers,
            _numOfTransfers,
            _period,
            0
        );
        creatorToIds[msg.sender].push(id);
        emit Transfer(address(0), msg.sender, id);
        return id;
    }

    /**
     * @dev Struct made to make it easier to pass parameters to the multiple mint function.
     */
    struct mintInput {
        string itemSerialNumber;
        string uri;
        bool unlimitedTransfers;
        uint numOfTransfers;
        uint period;
    }

    /**
     * @notice Mints multiple warranty tokens in a single transaction.
     */
    function multipleMint (mintInput[] calldata input) external {
        for (uint i = 0; i < input.length; i++) {
            mint(input[i].itemSerialNumber, input[i].uri, input[i].unlimitedTransfers, input[i].numOfTransfers, input[i].period);
        }
    }

    /**
     * @notice Transfers the token id to the address specified.
     * @param _to The address to transfer the token to.
     * @param _tokenId The token id to transfer.
     * @dev If there is no current owner, it means it is a direct transfer from Creator/Approver to a
     * customer, in this case the timestamp field is activated and warranty period starts. If threre is
     * a current owner, it means it is a transfer from the current owner to a new owner, the creator is 
     * not involved, in this case timestamp field does not change and only the ownership changes if the
     * there are transfers available.
     * Requirements:
     * `_to` cannot be the zero address.
     */
    function transferTo(address _to, uint _tokenId) public {
        require(_to != address(0), "Cannot transfer to 0x0!");
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

    /**
     * @notice Helper function that transfers the token id to the address specified. Used in the 
     * transferTo function.
     */
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

    /**
     * @notice Approves the given address for the specified token.
     * @param _approved The address to approve.
     * @param _tokenId The token id to perform the operation on.
     * @dev Only the creator is allowed to perform this operation and this approve is
     * fundamentally different from the standard ERC-721 approve function.
     */
    function approve(address _approved, uint256 _tokenId) external onlyCreator(_tokenId) {
        idToApproved[_tokenId] = _approved;
        emit Approval(msg.sender, _approved, _tokenId);
    }

    /**
     * @notice Allows the creator and the approver to set the timestamp of the token. This is helpful in 
     * case of an extension of warranty.
     */
    function setTimestamp(uint _tokenId) external onlyCreatorOrApproved(_tokenId) {
        idToWarranty[_tokenId].timestamp = block.timestamp;
    }

    /**
     * @notice Allows the creator and the approver to set the period for the token.
     * This is helpful in case of an extension of warranty.
     */
    function setPeriod(uint _tokenId, uint _period) external onlyCreatorOrApproved(_tokenId) {
        idToWarranty[_tokenId].period = _period;
    }

    /**
     * @notice Checks if the given id points to a valid warranty.
     * @dev The warranty is not valid if:
     * 1. its validation period has expired
     * 2. it has not been minted yet
     * 3. it had been decayed 
     */
    function isValidWarranty(uint _tokenId) public view onlyValidToken(_tokenId) returns (bool) {
        if (idToWarranty[_tokenId].currentOwner == address(0) || 
            (idToWarranty[_tokenId].timestamp.add(idToWarranty[_tokenId].period.mul(1 days)) > block.timestamp)
           ) return true;
        return false;
    }

    /**
     * @notice Allows the creator or approver to burn or decay the token.
     * @dev Can only burn if it is not a valid warranty.
     */
    function decay(uint _tokenId) external onlyValidToken(_tokenId) onlyCreatorOrApproved(_tokenId) {
        require(!isValidWarranty(_tokenId));
        delete idToWarranty[_tokenId];
        delete idToApproved[_tokenId];
    }

    /**
     * @notice Allows the creator or approver to emit a Repair event.
     * @param _tokenId The token id to perform the operation on.
     * @param _uri The IPFS URI containing the details of the repair.
     * @dev An example URI may contain a json object with two keys "title" and
     * "content" with values as strings decribing the repair details.
     */
    function itemRepair(uint _tokenId, string calldata _uri) external onlyCreatorOrApproved(_tokenId) {
        emit ItemRepair(_tokenId, _uri);
    }

    /**
     * @notice Allows the creator or approver to replace an item with another.
     * @param _prevId The token id of the item to be replaced.
     * @param _newId The token id of the item to replace the previous one.
     * @dev The old item is essentially decayed.
     */
    function itemReplace(uint _prevId, uint _newId) onlyCreatorOrApproved(_prevId) onlyCreatorOrApproved(_newId) external {
        transferTo(idToWarranty[_prevId].currentOwner, _newId);
        delete idToWarranty[_prevId];
        delete idToApproved[_prevId];
        emit ItemReplace(_prevId, _newId);
    }

}