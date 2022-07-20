import { downloadFile, uploadFile, deleteFile } from '../../utils/file-ops'
import { getTx } from '../../utils/contract'

export default async function handler (req, res) {
    if(req.method === "POST") {
        if(req.query.method === "mint") {
            const dataArray = req.body
            const txParams = []
            const promise = new Promise((resolve, reject) => {
                let i = 0
                dataArray.forEach(async (dataObject) => {
                    i++;

                    const { url } = dataObject
                    const uuid = await downloadFile(url)
                    const newUrl = await uploadFile(uuid)
                    deleteFile(uuid)

                    dataObject.url = newUrl
                    const tx = await getTx(dataObject)
                    txParams.push(tx)

                    if ( i == dataArray.length ) resolve()
                })
            })

            await promise
            res.status(200).json(txParams)
        } else if(req.query.method === "transfer") {

        }
    }
}
