
const User = require("../models/user")
const validate = require("validator")
const jwt = require("jsonwebtoken");

exports.signup = async(req, res) => {
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
        res.status(201).json({
            message: "User Created",
            user: newUser,
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
      if (!user) {
        throw new Error("No User Found");
      }
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
  


exports.getAllUsers = async()=>{
    try {
        const users = await User.find({});
        if(users.length<1)
        {
            throw new Error("No Users Found");
        }
        else
        {
            res.status(200).send(users);
        }
    } catch (error) {
        if(error.message=="No User Found")
        {
            res.status(404).send("No Users Registered Yet")
        }
        else
        {
            res.status(400).send(error.message);
        }
    }
}