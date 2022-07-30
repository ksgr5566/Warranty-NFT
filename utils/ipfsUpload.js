const Moralis = require("moralis/node");
const appId = process.env.MORALIS_APP_ID;
const serverUrl = process.env.MORALIS_SERVER_URL;
const masterkey = process.env.MORALIS_MASTER_KEY;

const btoa = function (str) {
  return Buffer.from(str).toString("base64");
};

async function uploadObject(object) {
  await Moralis.start({
    serverUrl: serverUrl,
    appId: appId,
    masterKey: masterkey,
  });
  const file = new Moralis.File("file.json", {
    base64: btoa(JSON.stringify(object)),
  });
  const result = await file.saveIPFS({ useMasterKey: true });
  return result._ipfs;
}

export { uploadObject };
