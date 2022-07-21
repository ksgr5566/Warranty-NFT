import { downloadFile, uploadFile, deleteFile } from '../../utils/file-ops'
import { getTx, getNonce } from '../../utils/contract'

export default async function handler (req, res) {
    if(req.method === "POST") {
        const operation = req.query.operation
        const dataArray = req.body
        const txParams = []
        const keyMap = {}
        const promise = new Promise((resolve, reject) => {
            dataArray.forEach(async (dataObject) => {
                /*
                const { url } = dataObject
                const uuid = await downloadFile(url)
                const newUrl = await uploadFile(uuid)
                deleteFile(uuid)

                dataObject.url = newUrl
                */

                const { publicKey } = dataObject
                const nonce = await getNonce(publicKey)
                const tx = await getTx(dataObject, operation, nonce + (keyMap[publicKey] === undefined ? 0 : keyMap[publicKey]))
                txParams.push(tx)
                keyMap[publicKey] = (keyMap[publicKey] === undefined ? 1 : keyMap[publicKey]+1)
                if (txParams.length === dataArray.length) resolve()
            })
        })           
        
        await promise
        res.status(200).json(txParams)
    }
}
