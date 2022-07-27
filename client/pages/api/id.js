import { web3, contract } from '../../utils/config'

export default async function handler (req, res) {
    const id = req.body.id
    const responseObject = {
        warrantyDetails: {},
        replacementDetails: {},
        repairDetails: {},
        transactionHistory: {}
    }

    responseObject.warrantyDetails = await contract.methods.idToWarranty(id).call((err, res)=> res)

    res.status(200).json({responseObject})
}