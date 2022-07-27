import { web3, contract } from '../../utils/config'

export default async function handler (req, res) {
    const id = req.query.id
    const responseObject = {
        warrantyDetails: {},
        approvedAddress: "",
        replacementDetails: {},
        repairDetails: {},
        transactionHistory: []
    }

    responseObject.warrantyDetails = await contract.methods.idToWarranty(id).call((err, res)=> res)
    responseObject.approvedAddress = await contract.methods.warrantyIdToApprovedAddress(id).call((err, res)=> res)

    const TransactionEvents = await contract.getPastEvents('Transfer', { filter: {_tokenId: id} ,fromBlock: 0, toBlock: "latest"})

    const promise = new Promise((resolve, reject) => {
        TransactionEvents.forEach(async (event, index) => {
            const block = await web3.eth.getBlock(event.blockNumber)
            const at = new Date(block.timestamp * 1000).toString()
            responseObject.transactionHistory.push({...event.returnValues, at: at})
            if (index === TransactionEvents.length - 1) resolve()
        })
    })

    await promise
    res.status(200).json({responseObject})
}