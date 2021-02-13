const User = require("../models/user")
const OTP = require("../models/otp");
const validate = require("validator")
const jwt = require("jsonwebtoken");
const mail = require("nodemailer");

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
        const newUser = await new User(req.body);
        const gentoken = await newUser.genAuthToken();
        console.log("gentoken", gentoken);
        await newUser.save();
        const otp_sent = await sendEmail(req.body.email);
        console.log(OTP_CREATED);
        // const Otp_sent = sendEmail(req.body.email);
        // console.log(Otp_sent);
        const Otp = await new OTP({otp:OTP_CREATED});
        console.log("In DB:",Otp);
        await Otp.save();
        res.status(201).json({
            message: "User Created",
            user: newUser,
            otp:Otp._id,
            token: gentoken,
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