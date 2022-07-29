import fast2sms from "fast-two-sms"



// app.post("/sendMessage",async (req,res) =>{
//     var options = await fast2sms.sendMessage({authorization : process.env.API_KEY , message : req.body.message ,  numbers : [req.body.number]}) 
//     res.send(options);

// })

  async function sendMessage(phoneNumber){
    const response = await fast2sms.sendMessage({authorization : apiKey , message : "hello world" ,  numbers : [phoneNumber]}) 
    console.log(response);
  }

  export default sendMessage;