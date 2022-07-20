const fs = require('fs')  
const Path = require('path')  
const axios = require('axios')
const crypto = require('crypto')
const { Web3Storage, getFilesFromPath } = require("web3.storage")

async function downloadFile(url) {
    const uuid = crypto.randomUUID()

    const path = Path.resolve("./utils", "uploads", uuid)
    const writer = fs.createWriteStream(path)
    
    const response = await axios({
        url,
        method: 'GET',
        responseType: 'stream'
    })
    
    response.data.pipe(writer)

    return new Promise((resolve, reject) => {
        writer.on('error', reject)
        response.data.on('end', () => {
            resolve(uuid)
        })
    })
}

async function uploadFile(uuid) {
    const files = []
    const path = "./utils/uploads/" + uuid
    const token = process.env.WEB3_STORAGE_TOKEN
    const storage = new Web3Storage({ token })
    const filePath = await getFilesFromPath(path);
    files.push(...filePath)

    return new Promise(async (resolve, reject) => {
        try {
            const cid = await storage.put(files)
            resolve(cid + ".ipfs.dweb.link/" + uuid)
        } catch (error) {
            console.log(error)
            reject()
        }
    })
}

function deleteFile(uuid) {
    const path = "./utils/uploads/" + uuid
    try {
        fs.unlinkSync(path);
    } catch (err) {
        console.log(err);
    }
}

export { downloadFile, uploadFile, deleteFile }