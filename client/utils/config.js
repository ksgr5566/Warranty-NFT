import Web3 from "web3"

const contractAddress = "0x9EB315F17fd73f11B3Cb7FDa1Cee6dda846610C1"
const abiFile = require("../../artifacts/contracts/WarrantyNFT.sol/WarrantyNFT.json")
const web3 = new Web3(`https://polygon-mumbai.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_TESTNET_API_KEY}`)
const contract = new web3.eth.Contract(abiFile.abi, contractAddress)

export { contractAddress, abiFile, web3, contract }