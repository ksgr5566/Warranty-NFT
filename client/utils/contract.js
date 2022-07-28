import { web3, contract, contractAddress, abiFile } from "./config"

const parseReceiptEvents = require('web3-parse-receipt-events')
 
function getNonce (publicKey) {
    return new Promise ((resolve, reject) => {
        web3.eth.getTransactionCount(publicKey, "latest").then(nonce => resolve(nonce))
    })
}

async function getTx (dataObject, operation, publicKey) {
    const nonce = await getNonce(publicKey)
    let data
    switch (operation) {
        case "mint": {
            data = contract.methods.multipleMint(dataObject).encodeABI()
            break
        }
        case "transfer": {
            const { address, id } = dataObject
            data = contract.methods.transferTo(address, id).encodeABI()
            break
        }
        case "approve": {
            const { address, id } = dataObject
            data = contract.methods.approve(address, id).encodeABI()
            break
        }
        case "repair": {
            const { id, uri } = dataObject
            data = contract.methods.itemRepair(id, uri).encodeABI()
            break
        }
        case "replace": {
            const { prevId, newId } = dataObject
            data = contract.methods.itemReplace(prevId, newId).encodeABI()
            break
        }
        case "decay": {
            const { id } = dataObject
            data = contract.methods.decay(id).encodeABI()
            break
        }
        default: {
            throw "Invalid operation"
        }
    }
  
    const tx = {
        gasPrice: web3.utils.toHex(web3.utils.toWei("50", "gwei")), //160
        gasLimit: web3.utils.toHex(1000000), // minus one zero
        to: contractAddress,
        //value: '0x00',
        data: data,
        nonce: web3.utils.toHex(nonce),
        maxPriorityFeePerGas: web3.utils.toHex(web3.utils.toWei("30", "gwei")), //300
        maxFeePerGas: web3.utils.toHex(web3.utils.toWei("80", "gwei")), //800
    }
    return tx;
}

async function send (signature) {
    const receipt = await web3.eth.sendSignedTransaction(signature).on("receipt", receipt => receipt).on("error", (error) => {error: error})
    if (receipt.error !== undefined) return {error: receipt.error}
    const readableReceipt = parseReceiptEvents(abiFile.abi, contractAddress, receipt)
    const events = readableReceipt.events
    let returnValues
    if (events.ItemRepair !== undefined) {
        returnValues = events.ItemRepair.returnValues
    } else if (events.Transfer !== undefined && events.ItemReplace === undefined) {
        if (events.Transfer instanceof Array) {
            returnValues = []
            events.Transfer.forEach((transfer) => {
                returnValues.push(transfer.returnValues)
            })
        } else {
            returnValues = events.Transfer.returnValues
        }
    } else if (events.Approve !== undefined) {
        returnValues = events.Approve.returnValues
    } else if (events.ItemReplace !== undefined) {
        returnValues = {}
        returnValues.ItemReplace = events.ItemReplace.returnValues
        returnValues.Transfer = events.Transfer.returnValues
    }

    return returnValues
}

export { getTx, send, getNonce }