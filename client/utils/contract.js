import { abiFile, contractAddress } from "./config"

const Web3 = require("web3")
const web3 = new Web3(`https://polygon-mumbai.g.alchemy.com/v2/${process.env.ALCHEMY_TESTNET_API_KEY}`)
const contract = new web3.eth.Contract(abiFile.abi, contractAddress)

function getNonce (publicKey) {
    return new Promise ((resolve, reject) => {
        web3.eth.getTransactionCount(publicKey, "latest").then(nonce => resolve(nonce))
    })
}

async function getTx (dataObject, operation, nonce) {
    console.log(nonce)
    let data
    if (operation === "mint") {
        const { itemSerialNumber, url, unlimitedTransfers, numOfTransfers, period } = dataObject
        data = contract.methods.mint(itemSerialNumber, url, unlimitedTransfers, numOfTransfers, period).encodeABI()
    } else if (operation === "transfer") {
        const { address, id } = dataObject
        data = contract.methods.transferTo(address, id).encodeABI()
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
    return await web3.eth.sendSignedTransaction(signature).on("receipt", receipt => receipt)
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