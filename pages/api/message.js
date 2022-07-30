import { sendMessage } from "../../utils/sendMessage";

export default async function handler (req, res) {
  if (req.method === "POST") {
    const { phone, id } = req.body;
    try {
      await sendMessage(phone, id);
      res.status(200).json({ success: true });
    } catch (e) {
      res.json({ success: false });
    }
  }
}
