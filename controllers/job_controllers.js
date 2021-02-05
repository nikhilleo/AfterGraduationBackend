
const Jobs = require("../models/jobs")

exports.addJob = async(req,res)=>{
    try {
        if(!req.body.jobTitle)
        {
            throw new Error("Job Title Reqeuired")
        }
        if(!req.body.jobDesc)
        {
            throw new Error("Job Description Reqeuired")
        }
        const job = await new Jobs(req.body);
        await job.save();
        res.status(201).json({"message":"Job Created","job_details":job});
    } catch (error) {
        if(error.message=="Job Title Reqeuired")
        {
            res.status(400).send(error.message)
        }
        else if(error.message=="Job Description Reqeuired")
        {
            res.status(400).send(error.message)
        }
        else
        {
            res.status(400).send(error.message);
        }
    }
}


exports.getAllJobs = async(req,res)=>{
    try {
        const allJobs = await Jobs.find({});
        if(allJobs.length<1)
        {
            throw new Error("No Jobs Added Yet")
        }
        res.status(200).send(allJobs);
    } catch (error) {
        if(error.message=="No Jobs Added Yet")
        {
            res.status(404).send("No Jobs Found");
        }
        else
        {
            res.status(400).send(error.message);
        }
    }
}