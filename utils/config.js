import Web3 from "web3"

const contractAddress = "0x3461b50cC500BD72f8F3192741D44958821FeBa0"
const abiFile = require("../artifacts/contracts/WarrantyNFT.sol/WarrantyNFT.json")
const web3 = new Web3(`https://polygon-mumbai.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_TESTNET_API_KEY}`)
const contract = new web3.eth.Contract(abiFile.abi, contractAddress)

export { contractAddress, abiFile, web3, contract }