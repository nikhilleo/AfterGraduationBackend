
require("dotenv").config();
const mongoose = require('mongoose');
const uri = process.env.DB_URL;

mongoose.connect(
    uri 
, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
}).then(()=>{
    console.log("Database Connected")
}).catch((err)=>{
    console.log(err.message);
})