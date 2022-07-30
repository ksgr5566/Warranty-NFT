import fast2sms from "fast-two-sms"

async function sendMessage(phoneNumber, id) {
  const response = await fast2sms.sendMessage({
    authorization: process.env.NEXT_PUBLIC_FAST2SMS_API_KEY,
    message: "You have new token with the id of " + id + " in your wallet!",
    numbers: [phoneNumber],
  })
  console.log(response)
}

export { sendMessage }
