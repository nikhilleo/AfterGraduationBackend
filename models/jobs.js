


const mongoose = require('mongoose');

const jobsSchema = new mongoose.Schema({
    jobTitle:{
        type:String,
        trim:true,
        required:true
    },
    jobDesc:{
        type:String,
        trim:true,
        required:true
    }
},{timestamps:true});


const Jobs = mongoose.model("Jobs",jobsSchema);
module.exports = Jobs;