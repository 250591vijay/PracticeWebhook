const express = require("express");
const axios = require("axios");
const app = express();

// forntend se json data aaeyg
// middleware to get the json data from frontend
app.use(express.json());
// {payloadUrl:'URL',secret:''}
// To store inmemory we create a object name webhooks
// Key = event type is an array
const webhooks = {
  COMMIT: [],
  PUSH: [],
  MERGE: [],
};
// Request handler
// Webhook ko register karne k liye ek endpoint banao
// /api/webhooks
app.post("/api/webhooks", (req, res) => {
  const { payloadUrl, secret, eventTypes } = req.body;
  // ['COMMIT','PUSH']
  eventTypes.forEach((eventType) => {
    webhooks[eventType].push({
      payloadUrl,
      secret,
    });
  });
  return res.sendStatus(201);
});
app.post("/api/event-emulate", (req, res) => {
  //type kis event hai aur data kya hai
  // Data is coming from frontend
  const { type, data } = req.body;
  // Business logic goes here
  // Emulating a delay in processing

  //Event trigger(call,webhook)
  // Webhook ko trigger karne k liye async use karte hai
  setTimeout(async() => {
// This statement contain the array of webhooks
    const webhookList =webhooks[type]
    // Async code
    for (let i = 0; i < webhookList.length; i++) {
       const webhook = webhookList[i];
        const{payloadUrl,secret} =webhook;
       // fetch(payloadUrl,{method:'POST',headers:{'Content-Type':'application/json'},body:data})
       // axios http request karne k liye
       try {
        await axios.post(payloadUrl,data,{
          headers:{
              'x-secret':secret,
          },
         });
        
       } catch (error) {
        console.error(error);
       }
       
    }
  }, 1000);
  res.sendStatus(200);
});

// Donot do this this in production
// This api show that the registered webhooks are stored in memory
// In real world we will store it in database
app.get('/api/db',(req,res)=>{
res.json(webhooks)
});

app.get("/", (req, res) => {
  res.send("<h1>Webhook Server</h1>");
});

// app.listen(3000,()=>console.log('Server started at port 3000'))

const PORT = process.env.PORT || 5600;
app.listen(PORT, () => {
  console.log(`The port is listening on ${PORT}`);
});
