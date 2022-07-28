import { send } from '../../utils/contract'

export default async function handler (req, res) {
    if(req.method === "POST") {
        const dataArray = req.body
        const receiptArray = []
        const promise = new Promise((resolve, reject) => {
            dataArray.forEach(async (dataObject) => {
                try {
                    const { signature } = dataObject
                    const x = Math.floor(Date.now() / 1000)
                    const receipt = await send(signature)
                    const y = Math.floor(Date.now() / 1000)
                    console.log("Time taken:", y - x)
                    receiptArray.push(receipt)
                } catch (error) {
                    console.log(error)
                    receiptArray.push(error)
                }
                if (receiptArray.length === dataArray.length) resolve()
            })
        })
        await promise
        res.status(200).json(receiptArray)
    }
}