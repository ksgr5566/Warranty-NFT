import { downloadFile, uploadFile, deleteFile } from '../../utils/file-ops.js'

export default async function handler (req, res) {
    if(req.method === "POST") {
        const dataArray = req.body
        const txParams = []
        await dataArray.forEach(async (dataObject) => {
            const { publicKey, itemSerialNumber, url, soulbound, unlimitedTransfers, numOfTransfers, period } = dataObject

            // const newUrl = await downloadFile(url).then(async (uuid) => {
            //     return uploadFile(uuid).then(cid => {
            //         deleteFile(uuid)
            //         return cid + ".ipfs.dweb.link/" + uuid
            //     })
            // })

            const uuid = await downloadFile(url)
            await new Promise((resolve) => setTimeout(resolve, 5000));
            const newUrl = await uploadFile(uuid)
            await new Promise((resolve) => setTimeout(resolve, 5000));
            deleteFile(uuid)
            
            txParams.push({url: newUrl})
            console.log(newUrl)


        })
        await new Promise((resolve) => setTimeout(resolve, 15000));
        res.status(200).json(txParams)
    }
}
