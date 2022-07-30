import { web3, contract } from '../../utils/config'
import fetch from 'node-fetch'

export default async function handler (req, res) {
    const id = req.query.id
    const responseObject = {
        warrantyDetails: {},
        approvedAddress: "",
        replacementDetails: {},
        repairDetails: [],
        transactionHistory: []
    }

    responseObject.warrantyDetails = await contract.methods.idToWarranty(id).call((err, res)=> res)
    responseObject.approvedAddress = await contract.methods.idToApproved(id).call((err, res)=> res)

    const TransactionEvents = await contract.getPastEvents('Transfer', { filter: {_tokenId: id} ,fromBlock: 0, toBlock: "latest"})
    const transactionHistoryPromise = new Promise((resolve, reject) => {
        TransactionEvents.forEach(async (event, index) => {
            const block = await web3.eth.getBlock(event.blockNumber)
            const at = new Date(block.timestamp * 1000).toString()
            responseObject.transactionHistory.push({...event.returnValues, at: at})
            if (index === TransactionEvents.length - 1) resolve()
        })
    })

    const RepairEvents = await contract.getPastEvents('ItemRepair', { filter: {_tokenId: id} ,fromBlock: 0, toBlock: "latest"})
    const repairHistoryPromise = new Promise((resolve, reject) => {
        RepairEvents.forEach(async (event, index) => {
            const block = await web3.eth.getBlock(event.blockNumber)
            const at = new Date(block.timestamp * 1000).toString()
            let url = event.returnValues.uri
            let data = await fetch(url)
            let body = await data.json()
            const { title, content } = body
            responseObject.repairDetails.push({
                at: at,
                title: title,
                content: content
            })
            if (index === RepairEvents.length - 1) resolve()
        })
        if (RepairEvents.length === 0) resolve()
    })

    const ReplaceEvent = await contract.getPastEvents('ItemReplace', { filter: {_newTokenId: id} ,fromBlock: 0, toBlock: "latest"})
    if (ReplaceEvent.length === 1) {
        const replaceHistoryPromise = new Promise(async (resolve, reject) => {
            const block = await web3.eth.getBlock(ReplaceEvent[0].blockNumber)
            const at = new Date(block.timestamp * 1000).toString()
            responseObject.replacementDetails = {
                at: at,
                prevId: ReplaceEvent[0].returnValues._replacedTokenId,
            }
            resolve()
        })
        await replaceHistoryPromise
    }
    
    await transactionHistoryPromise
    await repairHistoryPromise
    res.status(200).json({responseObject})
}