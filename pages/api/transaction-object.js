import { downloadFile, uploadFile, deleteFile } from "../../utils/file-ops";
import { getTx } from "../../utils/contract";
import { uploadObject } from "../../utils/ipfsUpload";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const operation = req.query.operation;
      const { publicKey, data } = req.body;
      let txParams;

      switch (operation) {
        case "mint": {
          let dataArray = [];
          let errorObjects = [];
          const promise = new Promise((resolve, reject) => {
            data.forEach(async (dataObject, index) => {
              try {
                const { uri } = dataObject;
                const uuid = await downloadFile(uri);
                const newUrl = await uploadFile(uuid);
                deleteFile(uuid);
                dataObject.uri = newUrl;
                console.log(dataObject)
                dataArray.push(dataObject);
              } catch (e) {
                errorObjects.push(dataObject);
              }
              if (index === data.length - 1) resolve();
            });
          });
          await promise;
          console.log(dataArray)
          txParams = await getTx(dataArray, operation, publicKey);
          res.status(200).json({ txParams: txParams, errorObjects: errorObjects });
          return
        }
        case "repair": {
          const obj = {
            title: data.title,
            content: data.content
          }
          const uri = await uploadObject(obj);
          const dataObject = { id: data.id, uri: uri };
          txParams = await getTx(dataObject, operation, publicKey);
          res.status(200).json({ txParams: txParams });
          return
        }
      }
      txParams = await getTx(data, operation, publicKey);
      res.status(200).json({ txParams: txParams });
    } catch (e) {
        console.log(e)
        res.status(400).json({ error: e })
    }
  }
}