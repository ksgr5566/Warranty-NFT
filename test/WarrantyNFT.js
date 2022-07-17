"use strict"
const WarrantyNFT = artifacts.require("WarrantyNFT")
const { expect } = require("chai")
const utils = require("./helpers/utils")
const time = require("./helpers/time")

contract("WarrantyNFT", (accounts) => {
    
    let [alice, bob, jose, monica] = accounts
    let contractInstance

    beforeEach(async () => {
        contractInstance = await WarrantyNFT.new()
    })

    it("should create a new Warranty NFT", async () => {
        const result = await contractInstance.mint("No. 1", "No1.uri.com", false, false , 3 , 300, {from: alice})
        expect(result.receipt.status).to.equal(true)
    })

    context("approves the transfer of the item", () => {

        let res, id
    
        beforeEach(async () => {
            res = await contractInstance.mint("No. 1", "No1.uri.com", false, false , 3 , 300, {from: alice})
            id = res.logs[0].args._tokenId
            await contractInstance.approve(bob, id, {from: alice})
        })

        it("should successfully approve if the caller is creator", async () => {
            expect(await contractInstance.isApprovedAddress(bob, id)).to.equal(true)
        })

        it("should throw if the caller is not the creator", async () => {
            await utils.shouldThrow(contractInstance.approve(jose, id, {from: bob}))
        })
           
    })

    context("successfully transfers the item", () => {

        it("should successfully transfer the NFT if no of transfers is greater than 1", async () => {
            let res = await contractInstance.mint("No. 1", "No1.uri.com", false, false , 3 , 300, {from: alice})
            let id = res.logs[0].args._tokenId
            await contractInstance.transferTo(bob, id, {from:alice})
            expect(await contractInstance.getOwner(id)).to.equal(bob);
        })

        it("should succesfully transfer the NFT if unlimited transfers is true ", async () => {
            let res = await contractInstance.mint("No. 1", "No1.uri.com", false, true, 0, 300, {from: alice})
            let id = res.logs[0].args._tokenId
            await contractInstance.transferTo(bob, id, {from:alice})
            expect(await contractInstance.getOwner(id)).to.equal(bob); 
        })

        it("should throw if the NFT is soulBound and the caller is not the creator, i.e, the customer" , async () => {
            let res = await contractInstance.mint("No. 1", "No1.uri.com", true, false, 0 , 300, {from: alice})
            let id = res.logs[0].args._tokenId
            await contractInstance.transferTo(bob, id)
            await utils.shouldThrow(contractInstance.transferTo(jose, id, {from: bob}))
        })

        it("should transfer if caller is the creator/approved regardless of above 3 conditions", async () => {
            let res = await contractInstance.mint("No. 1", "No1.uri.com", true, false, 0 , 300, {from: alice})
            let id = res.logs[0].args._tokenId
            let creatorTransferResult = await contractInstance.transferTo(bob, id, {from:alice})
            expect(creatorTransferResult.receipt.status).to.equal(true)
            await contractInstance.approve(jose, id, {from: alice})
            let approveTransferResult = await contractInstance.transferTo(monica, id, {from: jose})
            expect(approveTransferResult.receipt.status).to.equal(true)
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

    context("successfully decays the warranty", () => {

        let res, id

        beforeEach(async () => {
            res = await contractInstance.mint("No. 1", "No1.uri.com", false, false , 3 , 1, {from: alice})
            id = res.logs[0].args._tokenId
            await contractInstance.transferTo(bob, id, {from: alice})
        })

        it("should throw if it's still a valid warranty", async () => {
            await utils.shouldThrow(contractInstance.decayWarranty(id, {from: alice}))
        })

        it("should decay once the validity period is over", async () => {
            await time.increase(time.duration.days(1));
            const decayResult = await contractInstance.decayWarranty(id, {from: alice})
            expect(decayResult.receipt.status).to.equal(true)
            expect(await contractInstance.getOwner(id)).to.not.equal(bob)
        })

    })

})