const express = require('express');
require('dotenv').config();
const app = express();
// To validate the json data which is coming from frontend
app.use(express.json());

// Middle ware to validate custom haeader
// Syntax for  middle ware  app.get(path, (req, res, next) => {}, (req, res) => {})
const authMiddleware =(req,res,next)=>{
    const headers=req.headers;
    const secretHeader=headers["x-secret"]
    if(secretHeader!==process.env.WEBHOOK_SECRET){
        return res.sendStatus(401);
    }
    next();
}
//To store in memory for testing purpose
// Jo v data aayega wo is temp memory m push ho ga
// this come in array form
const message=[];

//routes
// use of authMiddleware as a middleware function
app.post('/git-info',authMiddleware,(req,res)=>{
    console.log(req.headers);
  const data = req.body;
  message.push(data);
  res.sendStatus(200).send("Data received successfully");
})

// To check the data stored in memory at http://localhost:5601
app.get('/',(req,res)=>{
    return res.json(message);
})

const PORT = process.env.PORT || 5601;
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});