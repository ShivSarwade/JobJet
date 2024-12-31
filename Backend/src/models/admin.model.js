import mongoose, { Schema } from "mongoose";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const adminSchema=new Schema({
    adminUserName:{
        type:String,
        lowercase:true,
        trim:true,
        index:true
    },
    adminEmail:{
        type:String,
        unique:true,
        lowercase:true,
        trim:true,
        index:true
    },
    adminPassword:{
        type:String,
        required: [true, 'Password is required']
    },
    refreshToken:{
        type:String
    }
},{timestamps:true})

adminSchema.pre("save",async function (next) {
    if(this.isModified("adminPassword")){
        this.adminPassword=await bcrypt.hash(this.adminPassword,7)
        next()
    }
    else{
        next()
    }
})
adminSchema.methods.isPasswordCorrect=async function (password) {
    return await bcrypt.compare(password,this.adminPassword)
}
adminSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            adminUserName: this.adminUserName,
            adminEmail: this.adminEmail,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
adminSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

export const Admin=mongoose.model("Admin",adminSchema)