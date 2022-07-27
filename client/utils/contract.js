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

        }
        case "decay": {

        }
        default: {
            throw "Invalid operation"
            return
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
  
    const receipt = await web3.eth.sendSignedTransaction(signature).on("receipt", receipt => receipt)
    web3.eth.getTransactionReceipt(receipt.transactionHash)
    .then(receipt => parseReceiptEvents(abiFile.abi, contractAddress, receipt))
    .then((a) => {
        console.log(a.events.ItemRepair.returnValues)
    })
//     console.log(x)
//     console.log(typeof x)
//     let xe = x.events
//     console.log(xe) //.ItemRepair.returnValues
// try{
//     let xei = xe.ItemRepair
//     console.log(xei)
//     console.log(xei.returnValues)
// } catch (e) {
//     console.log("Asdfsjgdfhkjahlsdfcnlkajsdnlvcm")
// }
    
    // let x = await web3.eth.getTransactionReceipt(receipt.transactionHash)
    // const logs = await contract.events.itemRepair().processReceipt(x)
    // console.log(logs)

    return receipt
}

function getEvent (blockNum, from) {
    return new Promise((resolve, reject) => {
        contract.getPastEvents('Transfer', {
            filter: { _to: from},
            fromBlock: blockNum,
            toBlock: "latest"
        }, (error, events) => {
            if (error) reject(error)
            resolve(events)
        })
    })
}

export { getTx, send, getNonce, getEvent }