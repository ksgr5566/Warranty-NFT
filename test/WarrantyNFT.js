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

    context("successfully mints", () => {

        it("should create single Warranty NFT", async () => {
            const result = await contractInstance.mint("No. 1", "No1.uri.com", false , 3 , 300, {from: alice})
            expect(result.receipt.status).to.equal(true)
        })

        it("should create multiple nfts in a single transaction", async () => {
            const dataObject = [
                {
                    itemSerialNumber: "No. 1",
                    uri: "No1.uri.com",
                    unlimitedTransfers: false,
                    numOfTransfers: 3,
                    period: 350
                },
                {
                    itemSerialNumber: "No. 2",
                    uri: "No2.uri.com",
                    unlimitedTransfers: false,
                    numOfTransfers: 3,
                    period: 350
                },
                {
                    itemSerialNumber: "No. 3",
                    uri: "No3.uri.com",
                    unlimitedTransfers: false,
                    numOfTransfers: 3,
                    period: 350
                }
            ]
            const result = await contractInstance.multipleMint(dataObject, {from: alice})
            expect(result.receipt.status).to.equal(true)

            // console.log("Test starts")
            // const x = await contractInstance.idToWarranty(4, {from: alice})
            // console.log(x)
        })

    })

    context("approves the transfer of the item", () => {

        let res, id
    
        beforeEach(async () => {
            res = await contractInstance.mint("No. 1", "No1.uri.com", false , 3 , 300, {from: alice})
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
            let res = await contractInstance.mint("No. 1", "No1.uri.com", false , 3 , 300, {from: alice})
            let id = res.logs[0].args._tokenId
            await contractInstance.transferTo(bob, id, {from:alice})
            expect(await contractInstance.warrantyIdToOwner(id)).to.equal(bob);
        })

        it("should succesfully transfer the NFT if unlimited transfers is true ", async () => {
            let res = await contractInstance.mint("No. 1", "No1.uri.com", true, 0, 300, {from: alice})
            let id = res.logs[0].args._tokenId
            await contractInstance.transferTo(bob, id, {from:alice})
            expect(await contractInstance.warrantyIdToOwner(id)).to.equal(bob); 
        })

        it("should transfer if caller is the creator/approved regardless of above 2 conditions", async () => {
            let res = await contractInstance.mint("No. 1", "No1.uri.com", false, 0 , 300, {from: alice})
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
            res = await contractInstance.mint("No. 1", "No1.uri.com", false , 3 , 300, {from: alice})
            id = res.logs[0].args._tokenId
        })
        
        it("should successfully replace if the caller is a valid one", async () => {
            const replaceResult = await contractInstance.itemReplace(id, "Replaced No. 1", "Replaced No1.uri.com", false , 3 , 300, {from: alice})
            expect(replaceResult.receipt.status).to.equal(true)
        })

        it("should throw if the caller is not a valid one", async () => {
            await utils.shouldThrow(contractInstance.itemReplace(id, "Replaced No. 1", "Replaced No1.uri.com", false , 3 , 300, {from: bob}))   
        })
        
    })

    context("successfully decays the warranty", () => {

        let res, id

        beforeEach(async () => {
            res = await contractInstance.mint("No. 1", "No1.uri.com", false , 3 , 1, {from: alice})
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
            expect(await contractInstance.warrantyIdToOwner(id)).to.not.equal(bob)
        })

    })

    

})