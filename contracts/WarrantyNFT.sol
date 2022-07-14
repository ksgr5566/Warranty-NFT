// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract WarrantyNFT {

    using SafeMath for uint256;

    struct Warranty {
        address Owner;
        string itemSerialNumber;
        string uri;
    }

    Warranty[] private _collection;

    mapping (uint => address) private _warrantyToOwner;
    mapping (address => uint) private _ownerWarrantyCount;

    function createWarranty(string memory _itemSerialNumber, string memory _uri) external {
        _collection.push(Warranty(msg.sender, _itemSerialNumber, _uri));
        uint id = _collection.length - 1;
        _ownerWarrantyCount[msg.sender].add(1);
        _warrantyToOwner[id] = msg.sender;
    }
    
    

}