import { create as ipfsHttpClient } from 'ipfs-http-client'
const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

async function uploadObject(object){
    try {
        const added = await client.add(
            JSON.stringify(object),
            {
                progress: (prog) => console.log(`received: ${prog}`)
            })
        const url = `https://ipfs.infura.io/ipfs/${added.path}`
        console.log(url)
        return url
    }
    catch(e){
        console.log(e)
    }
}

//uploadObject({title: "test", content: "test" , end:"tasting"})

export { uploadObject }

