// const { contract, web3, contractAddress } = require("../../scripts/contract")

//......................................................................................
// import nextConnect from 'next-connect';
// import multer from 'multer';

// const upload = multer({
//   storage: multer.diskStorage({
//     destination: './public/uploads',
//     filename: (req, file, cb) => cb(null, file.originalname),
//   }),
// });

// const apiRoute = nextConnect({
//   onError(error, req, res) {
//     res.status(501).json({ error: `Sorry something Happened! ${error.message}` });
//   },
//   onNoMatch(req, res) {
//     res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
//   },
// });

// apiRoute.use(upload.array('theFiles'));

// apiRoute.post((req, res) => {
//   res.status(200).json({ data: 'success' });
// });

// export default apiRoute;

// export const config = {
//   api: {
//     bodyParser: false, // Disallow body parsing, consume as stream
//   },
// };
//......................................................................................

// export default async function handler(req, res) {
//   if(req.method === "GET") {
//     let mintStats = await send()
//     res.status(200).json({...mintStats})
//   } else if(req.method === "POST") {
//     // let id = req.body.id
//     // req.formData().then(console.log)
//     // console.log(JSON.parse(req.body))
//     //res.status(200).json({...req.files.file})

//     var multer = require('multer');
//     var upload = multer({dest:"./temp"})

//     app.post('/file/singleFile',upload.single('file'),(req,res)=>{
//       console.log('Received a request with file:');
//       console.log(req.file);
//       res.send({code:200,message:'ok'});
//     })

//   }
// }

/*
const acc1 = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"
const key1 = "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d"

const Web3 = require("web3")
const abiFile = require("../../../artifacts/contracts/WarrantyNFT.sol/WarrantyNFT.json")

const web3 = new Web3("http://127.0.0.1:8545/")

const contractAddress = "0xA2E8c12cd916d2115990670fd59E9e4777cD307b"

const contract = new web3.eth.Contract(abiFile.abi, contractAddress)

const send = async () => {
  
  const tx = {
    from: acc1,
    to: contractAddress,
    gas: 100000,
    data: contract.methods.mint("No. 1", "No1.uri.com", false, false , 3, 300).encodeABI()
  }
  
  // let returnValue 
  const signature = await web3.eth.accounts.signTransaction(tx, key1)
  return await web3.eth.sendSignedTransaction(signature.rawTransaction).on("receipt", receipt => receipt)
  //web3.eth.sendSignedTransaction(signature.rawTransaction).then((x) => x)

  // return returnValue
}

// var express = require('express')
// var multer = require('multer');
// var upload = multer({dest:"./temp"})

// const app = express();
// app.use(express.static('public'));
// app.use(express.urlencoded({
//     extended: true
// }));

// app.post('/file/singleFile',upload.single('file'),(req,res)=>{
//     console.log('Received a request with file:');
//     console.log(req.file);
//     res.send({code:200,message:'ok'});
// })

//app.use('/file',express.static('./files'))
*/

import { Web3Storage, getFilesFromPath } from "web3.storage"
import formidable from 'formidable'
require("dotenv").config

export const config = {
  api: {
    bodyParser: false
  }
}

export default async function handler (req, res) {
  if (req.method === "POST") {
    // let id, description
    // const form = new formidable.IncomingForm()
    // form.uploadDir = "./public/uploads"
    // form.keepExtensions = true
    // //form.fileName = "hellowoeld"
    // form.keepFilenames = true;
    // form.parse(req, (err, fields, files) => {
    //   id = fields.id
    //   description = fields.description
    //   console.log(err, fields, files)
    //   res.send(err || "DONE")
    // })
    // // sleep for 2000ms
    // await new Promise(resolve => setTimeout(resolve, 5000))
    // console.log()
    // console.log()
    // console.log(id, description)
    // console.log()
    // console.log()

    const data = await new Promise((resolve, reject) => {

      const options = {
        keepExtensions: true,
        uploadDir: "./public/uploads"
      }

      const form = new formidable.IncomingForm(options)

      const fileObject = [{}]
  
      form.parse(req, (err, fields, files) => {
        if (err) reject({ err })
        console.log(req.files)

        let x = files.file
        
        fileObject[0].fieldname = "file"
        fileObject[0].originalname = x.originalFilename
        fileObject[0].encoding = "7bit"
        fileObject[0].mimetype = x.mimetype
        fileObject[0].destination = "./public/uploads"
        fileObject[0].filename = x.newFilename
        fileObject[0].path = "./public/uploads/" + x.newFilename
        fileObject[0].size = x.size

        resolve({ err, fields, files, fileObject })
      }) 
    })

    const { fileObject } = data

    const { newFileName } = data.files.file

    const cid = await Upload(fileObject).then(cid => cid)

    const url = cid + ".ipfs.dweb.link/" + newFileName

    let { itemSerialNumber, soulbound, unlimitedTransfers, numOfTransfers, period, publicKey } = data.fields
    soulbound = soulbound === "true"
    unlimitedTransfers = unlimitedTransfers === "true"
    numOfTransfers = parseInt(numOfTransfers)
    period = parseInt(period)

    const tx = getTxObject(publicKey, itemSerialNumber, url, soulbound, unlimitedTransfers, numOfTransfers, period)

    // const signature = await web3.eth.accounts.signTransaction(tx, "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d")
    // web3.eth.sendSignedTransaction(signature.rawTransaction).on("receipt", receipt => console.log(receipt))
    //return the data back or just do whatever you want with it
    res.status(200).json({...tx})
  }
}

const Web3 = require("web3")
const abiFile = require("../../../artifacts/contracts/WarrantyNFT.sol/WarrantyNFT.json")

const web3 = new Web3("http://127.0.0.1:8545/")

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"

const contract = new web3.eth.Contract(abiFile.abi, contractAddress)

const getTxObject = function (publicKey, itemSerialNumber, url, soulbound, unlimitedTransfers, numOfTransfers, period) {
  return {
    from: publicKey,
    to: contractAddress,
    gas: 500000,
    data: contract.methods.mint(itemSerialNumber, url, soulbound, unlimitedTransfers, numOfTransfers, period).encodeABI()
  }
}

// const send = async (signature) => {
//   return await web3.eth.sendSignedTransaction(signature.rawTransaction).on("receipt", receipt => receipt)
// }

// const signature = await web3.eth.accounts.signTransaction(tx, key1)

// const token = process.env.WEB3_STORAGE_TOKEN
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweEE5Q2M4RTI5ZjU2MGM0Zjg2M0M3MzliRjc0ZDQ1QTBhMzg2NmQ1NDUiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NTgxMjA5NzE0MTEsIm5hbWUiOiJhdmluYXNoIn0.yjm4jfeU4QJlRQjyKQmJRiwx0PcliS5jaGGID95FFRA"
const files = []

async function Upload(files_to_add) {

  const storage = new Web3Storage({ token })

  for (const file of files_to_add) {
      const filesPath = await getFilesFromPath(file.path);
      files.push(...filesPath);
  }

  console.log("Uploading " + files.length + " files");
  const cid = await storage.put(files);
  
  console.log("Content added with CID: " + cid);
  // deleteFiles(files_to_add);
  return cid
}

