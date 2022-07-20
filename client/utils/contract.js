const Web3 = require("web3")
const abiFile = require("../../artifacts/contracts/WarrantyNFT.sol/WarrantyNFT.json")

const web3 = new Web3(`https://polygon-mumbai.g.alchemy.com/v2/${process.env.ALCHEMY_TESTNET_API_KEY}`)

const contractAddress = "0x844f3Ed643f4d4e8466550f04Ac56e1D4D2a088e"

const contract = new web3.eth.Contract(abiFile.abi, contractAddress)

function getNonce (publicKey) {
    return new Promise ((resolve, reject) => {
        web3.eth.getTransactionCount(publicKey, "latest").then(nonce => resolve(nonce))
    })
}

async function getTx (dataObject) {
    const { publicKey, itemSerialNumber, url, unlimitedTransfers, numOfTransfers, period } = dataObject
    const nonce = await getNonce(publicKey)
    const tx = {
        gasPrice: web3.utils.toHex(web3.utils.toWei("50", "gwei")), //160
        gasLimit: web3.utils.toHex(1000000), // minus one zero
        to: contractAddress,
        //value: '0x00',
        data: contract.methods.mint(itemSerialNumber, url, unlimitedTransfers, numOfTransfers, period).encodeABI(),
        nonce: web3.utils.toHex(nonce),
        maxPriorityFeePerGas: web3.utils.toHex(web3.utils.toWei("30", "gwei")), //300
        maxFeePerGas: web3.utils.toHex(web3.utils.toWei("80", "gwei")), //800
    }
    return tx;
}

async function send (signature) {
    return await web3.eth.sendSignedTransaction(signature).on("receipt", receipt => receipt)
}

export { getTx, send }