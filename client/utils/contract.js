const Web3 = require("web3")
const abiFile = require("../../artifacts/contracts/WarrantyNFT.sol/WarrantyNFT.json")

const web3js = new Web3("http://127.0.0.1:8545/")

const contractAddress = "0xA2E8c12cd916d2115990670fd59E9e4777cD307b"

const contract = new web3js.eth.Contract(abiFile.abi, contractAddress)

export default { contract, web3js, contractAddress }