require("dotenv").config();
const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    mobile: {
        type: String,
        unique: true,
        trim: true,
        required: true,
        maxLength: 10
    },
    altmobile: {
        type: String,
        trim: true,
        maxLength: 10
    },
    email: {
        type: String,
        unique: true,
        trim: true,
        required: true,
    },
    password: {
        type: String,
        trim: true,
        required: true,
    },
    gender: {
        type: String,
        trim: true,
        required: true,
    },
    qualification: {
        type: String,
        trim: true,
        required: true
    },
    specialization: {
        type: String,
        trim: true,
        default: "",
        required: true,
    },
    other_specialization: {
        type: String,
        trim: true,
        // required: true,
        default: "",
    }



},  { timestamps: true });


userSchema.pre("save", async function (next){
    const user = this;
    if (user.isModified("password")) {
        const hashed = await bcrypt.hash(user.password, 14);
        user.password = hashed;
    }
    next();
});

userSchema.methods.genAuthToken = async function () {
    const user = this;
    console.log(user);
    const token = await jwt.sign({_id: user._id}, process.env.JWT_KEY, {expiresIn: 144000,});
    return token;
};


userSchema.statics.findByCredentials = async function (email, pass) {
    const user = await User.findOne({
        email: email
    });
    if (!user) {
        throw new Error("No User Found");
    } else {
        const match = await bcrypt.compare(pass, user.password);
        if (match) {
            return user;
        } else {
            throw new Error("Invalid Credentials");
        }
    }
};

const User = mongoose.model("User", userSchema);
module.exports = User;