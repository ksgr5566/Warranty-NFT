import { send } from '../../utils/contract'

export default async function handler (req, res) {
    if(req.method === "POST") {
        const dataArray = req.body
        const receiptArray = []
        const promise = new Promise((resolve, reject) => {
            let i = 0
            dataArray.forEach(async (dataObject) => {
                try {
                    const { signature } = dataObject
                    const receipt = await send(signature)
                    receiptArray.push(receipt)
                } catch (error) {
                    console.log(error)
                }
                if ( i == dataArray.length ) resolve()
            })
        })
        await promise
        res.status(200).json(receiptArray)
    }
}