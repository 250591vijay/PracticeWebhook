const express = require("express");
const axios = require("axios");
const app = express();

// forntend se json data aaeyg
// middleware to get the json data from frontend
app.use(express.json());
// {payloadUrl:'',secret:''}
const webhooks = {
  COMMIT: [],
  PUSH: [],
  MERGE: [],
};
// Request handler
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
  const { type, data } = req.body;
  // Business logic goes here
  // Emulating a delay in processing

  //Event trigger(call,webhook)

  setTimeout(async() => {
// This statement contain the array of webhooks
    const webhookList =webhooks[type]
    // Async code
    for (let i = 0; i < webhookList.length; i++) {
       const webhook = webhookList[i];
        const{payloadUrl,secret} =webhook;
       // fetch(payloadUrl,{method:'POST',headers:{'Content-Type':'application/json'},body:data})
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
