"use strict"
const WarrantyNFT = artifacts.require("WarrantyNFT")
const { expect } = require("chai")
const utils = require("./helpers/utils");

contract("WarrantyNFT", (accounts) => {
    
    let [alice, bob, jose] = accounts
    let contractInstance

    beforeEach(async () => {
        contractInstance = await WarrantyNFT.new()
    })

    it("should create a new Warranty NFT", async () => {
        const result = await contractInstance.mint("No. 1", "No1.uri.com", false, false , 3 , 300, {from: alice})
        expect(result.receipt.status).to.equal(true)
    })

    context("successfully transfers the item", () => {

        it("should successfully transfer the NFT if no of transfers is greater than 1", async () => {
            let res = await contractInstance.mint("No. 1", "No1.uri.com", false, false , 3 , 300, {from: alice})
            let id = res.logs[0].args._tokenId
            await contractInstance.transferFrom(bob,id , {from:alice})
            const newOwner = await contractInstance.getOwner(id);
            expect(newOwner).to.equal(bob);
        })

        it("should succesfully transfer the NFT if unlimited transfers is true ", async () => {
            let res = await contractInstance.mint("No. 1", "No1.uri.com", false, true, 0, 300, {from: alice})
            let id = res.logs[0].args._tokenId
            await contractInstance.transferFrom(bob, id, {from:alice})
            const newOwner = await contractInstance.getOwner(id)
            expect(newOwner).to.equal(bob); 
        })

        it("should throw if the NFT is soulBound and the caller is not the creator, i.e, the customer" , async () => {
            let res = await contractInstance.mint("No. 1", "No1.uri.com", true, false, 0 , 300, {from: alice})
            let id = res.logs[0].args._tokenId
            await contractInstance.transferFrom(bob, id)
            await utils.shouldThrow(contractInstance.transferFrom(jose, id, {from: bob}))
        })

        it("should transfer if caller is the creator/approved regardless of above 3 conditions", async () => {
            let res = await contractInstance.mint("No. 1", "No1.uri.com", true, false, 0 , 300, {from: alice})
            let id = res.logs[0].args._tokenId
            let transferResult = await contractInstance.transferFrom(bob, id, {from:alice})
            expect(transferResult.receipt.status).to.equal(true)
        })

    })
    
    context("successfully replaces the item", () => {
        
        let res, id

        beforeEach(async () => {
            res = await contractInstance.mint("No. 1", "No1.uri.com", false, false , 3 , 300, {from: alice})
            id = res.logs[0].args._tokenId
        })
        
        it("should successfully replace if the caller is a valid one", async () => {
            const replaceResult = await contractInstance.itemReplace(id, "Replaced No. 1", "Replaced No1.uri.com", false, false , 3 , 300, {from: alice})
            expect(replaceResult.receipt.status).to.equal(true)
        })

        it("should throw if the caller is not a valid one", async () => {
            await utils.shouldThrow(contractInstance.itemReplace(id, "Replaced No. 1", "Replaced No1.uri.com", false, false , 3 , 300, {from: bob}))
        })
        
    })

})