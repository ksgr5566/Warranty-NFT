import { downloadFile, uploadFile, deleteFile } from "../../utils/file-ops";

export default async function handler (req, res) {
  if (req.method === "POST") {
    const { url } = req.body;
    try {
      const uuid = await downloadFile(url);
      const newUrl = await uploadFile(uuid);
      deleteFile(uuid);
      res.status(200).json({ uri: newUrl });
    } catch (e) {
      res.json({ success: false });
    }
  }
}