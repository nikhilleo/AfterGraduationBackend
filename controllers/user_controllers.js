const User = require("../models/user")
const OTP = require("../models/otp");
const validate = require("validator")
const jwt = require("jsonwebtoken");
const mail = require("nodemailer");
const e = require("express");

var OTP_CREATED;

async function sendEmail(email) {
    const transporter = mail.createTransport({
        service: "hotmail",
        host: "smtp.office365.com",
        auth: {
            user: "aftergraduationck@outlook.com",
            pass: "nikhil1008"
        }
    });
    var otp = Math.floor(Math.random(0.5) * 1000000);
    if(otp.length<6)
    {
        otp+=8;
    }
    OTP_CREATED = otp;
    const mailOptions = {
        from: "aftergraduationck@outlook.com",
        to: email,
        subject: "Registered",
        text: `You Have Successfully Registered For Verification Enter OTP ${otp}`
    }
    await transporter.sendMail(mailOptions,async(err,info)=>{
        if(err)
        {
            console.log(err)
            // await OTP.findOneAndDelete({otp:Otp._id});
            return;
        }
        else if(info.response)
        {
            console.log("Sent " + info.response);
            // console.log(Otp);
            return;
        }
    })
    // const mail = await transporter.sendMail(mailOptions,async(res,err)=>{
    //     console.log(res);
    //     if(err)
    //     {
    //         console.log(err);
    //     }
    // })
    // .then((res) => {
    //     console.log("Sent " + res.response);
    //     // console.log(Otp);
    //     return otp;
    // }).catch((err) => {
    //     console.log(err)
    //     return;
    // })
    // console.log(mail);
}

exports.signup = async (req, res) => {
    try {
        console.log(req.body)
        const pass = req.body.password;
        const email = req.body.email;
        const phone = req.body.mobile;
        const phone1 = req.body.altmobile;
        if(!email)
        {
            throw new Error("Enter Email");
        }
        if (email) {
            if (!validate.isEmail(email)) {
                throw new Error("Invalid Email");
            }
        }
        if (pass.length < 7) {
            throw new Error("Password Invalid");
        }
        if (phone1) {
            if (!validate.isMobilePhone(phone1, "en-IN")) {
                throw new Error("Invalid Mobile Number");
            }
        }
        if (phone) {
            if (!validate.isMobilePhone(phone, "en-IN")) {
                throw new Error("Invalid Mobile Number");
            }
        }
        // const newUser = await new User(req.body);
        // const gentoken = await newUser.genAuthToken();
        // console.log("gentoken", gentoken);
        // await newUser.save();
        const otp_sent = await sendEmail(req.body.email);
        console.log(OTP_CREATED);
        // const Otp_sent = sendEmail(req.body.email);
        // console.log(Otp_sent);
        const Otp = await new OTP({otp:OTP_CREATED});
        console.log("In DB:",Otp);
        await Otp.save();
        res.status(201).json({
            message: "OTP Sent",
            user: req.body,
            otp:Otp._id,
            // token: gentoken,
        });
    } catch (error) {
        console.log(error);
        const msg = error.message;
        const msg_splitted = msg.split(" ");
        console.log("Conflict", msg_splitted[11]);
        if (msg_splitted[11] == "mobile:") {
            res.status(409).send("Mobile Number Already Exist Please Try New Credentials");
        } else if (msg_splitted[11] == "email:") {
            res.status(409).send("Email Already Exist Please Try New Credentials");
        } else if (error.message == "Password Invalid") {
            res.status(409).send("Password Length Must Be Atleast 7 Characters");
        } else if (error.message == "Invalid Emai") {
            res.status(409).send(error.message);
        } else if (error.message == "Invalid Mobile Number") {
            res.status(409).send(error.message);
        } else {
            res.status(409).send(error.message);
        }
    }
};


exports.verify_email = async(req,res)=>{
    try {
        console.log(req.body.user);
        if(!req.body.otp)
        {
            throw new Error("OTP Not Found")
        }
        const otp_in_db = await OTP.findById({_id:req.body.otp_id});
        if(otp_in_db.otp==req.body.otp)
        {
            const data = JSON.parse(req.body.user);
            const user = await new User(data);
            console.log(user);
            const gentoken = await user.genAuthToken();
            console.log("gentoken", gentoken);
            await user.save();
            await OTP.findByIdAndDelete({_id:otp_in_db._id});
            res.status(201).json({
                message: "User Created And Verified",
                user: user,
                otp:otp_in_db._id,
                token: gentoken,
            });
        }
        else
        {
            throw new Error("Wrong OTP");
        }
    } catch (error) {
        if(error.message=="OTP Not Found")
        {
            res.status(404).send(error.message);
        }
        else if(error.message == "Wrong OTP")
        {
            res.status(400).send(error.message);
        }
        else
        {
            res.status(400).send(error.message);
        }
    }
}



exports.login = async (req, res) => {
    try {
        let eMail = req.body.email;
        let passWord = req.body.password;
        const user = await User.findByCredentials(eMail, passWord);
        const token = await user.genAuthToken();
        res.status(200).json({
            Message: "Login Successfully",
            token: token,
            user: user,
        });
        console.log(user);
    } catch (error) {
        if (error.message == "No User Found") {
            res.status(404).send(error.message + " With Given Credentials");
        }
    }
};


exports.auth = async (req, res) => {
    try {
        console.log(req.profile);
        res.send(req.profile);
    } catch (error) {
        res.status(400).send(error.message)
    }
};



exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({});
        if (users.length < 1) {
            throw new Error("No Users Found");
        } else {
            res.status(200).send(users);
        }
    } catch (error) {
        if (error.message == "No User Found") {
            res.status(404).send("No Users Registered Yet")
        } else {
            res.status(400).send(error.message);
        }
    }
}