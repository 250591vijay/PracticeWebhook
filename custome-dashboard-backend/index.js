const express = require('express');
require('dotenv').config();
const app = express();
app.use(express.json());

//To store in memory for testing purpose
const message=[];

// Middle ware to validate custom haeader
const authMiddleware =(req,res,next)=>{
    const headers=req.headers;
    const secretHeader=headers["x-secret"]
    if(secretHeader!==process.env.WEBHOOK_SECRET){
        return res.sendStatus(401);
    }
    next();
}

//routes
// use of authMiddleware as a middleware function
app.post('/git-info',authMiddleware,(req,res)=>{
    console.log(req.headers);
  const data = req.body;
  message.push(data);
  res.sendStatus(200).send("Data received successfully");
})

app.get('/',(req,res)=>{
    return res.json(message);
})

const PORT = process.env.PORT || 5601;
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});