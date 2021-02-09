
require("dotenv").config();
const mongoose = require('mongoose');
const uri = process.env.DB_URL;
console.log(Date(Date.now()).toString());
mongoose.connect(
    uri 
, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
}).then(()=>{
    console.log("Database Connected")   
    console.log(Date(Date.now()).toString());
}).catch((err)=>{
    console.log(err.message);
})