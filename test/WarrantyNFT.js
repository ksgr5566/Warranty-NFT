const WarrantyNFT = artifacts.require("WarrantyNFT")
const { expect } = require("chai")

contract("WarrantyNFT", (accounts) => {
    let [alice, bob] = accounts
    let contractInstance
    beforeEach(async () => {
        contractInstance = await WarrantyNFT.new()
    })

    it("should create a new Warranty NFT", async () => {
        const result = await contractInstance.createWarranty("No. 1", "No1.uri.com", {from: alice})
        expect(result.receipt.status).to.equal(true)
        expect(result.logs[0].args.itemSerialNumber).to.equal("No. 1")
    })
})