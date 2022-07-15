const WarrantyNFT = artifacts.require("WarrantyNFT")
const { expect } = require("chai")
const utils = require("./helpers/utils");

contract("WarrantyNFT", (accounts) => {
    let [alice, bob] = accounts
    let contractInstance

    beforeEach(async () => {
        contractInstance = await WarrantyNFT.new()
    })

    it("should create a new Warranty NFT", async () => {
        const result = await contractInstance.mint("No. 1", "No1.uri.com", false, false , 3 , 300, {from: alice})
        expect(result.receipt.status).to.equal(true)
    })

    context("successfully replaces the item", async () => {
        const res = await contractInstance.mint("No. 1", "No1.uri.com", false, false , 3 , 300, {from: alice})
        const id = res.logs[0].args._tokenId
        
        it("should successfully replace if the caller is a valid one", async () => {
            const replaceResult = await contractInstance.itemReplace(id, "Replaced No. 1", "Replaced No1.uri.com", false, false , 3 , 300, {from: alice})
            expect(replaceResult.receipt.status).to.equal(true)
        })

        it("should throw if the caller is not a valid one", async () => {
            await utils.shouldThrow(contractInstance.itemReplace(id, "Replaced No. 1", "Replaced No1.uri.com", false, false , 3 , 300, {from: bob}))
        })
        
    })

})