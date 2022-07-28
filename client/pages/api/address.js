import { web3, contract } from '../../utils/config'

export default async function handler (req, res) {
    const address =  req.query.address
    const responseObject = {
        creator: [],
        owner: []
    }
    responseObject.creator = await contract.methods.getCreatorIds(address).call((err, res)=> res)
    responseObject.owner = await contract.methods.getOwnerIds(address).call((err, res)=> res)
    res.status(200).json({responseObject})
}