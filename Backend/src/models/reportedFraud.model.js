import mongoose, { Schema } from "mongoose";

const fraudSchema=new Schema(
    {
        email:{
            type:String,
            trim:true,
            required:true
        },
        jobTitle:{
            type:String,
            required:true
        },
        companyName:{
            type:String,
            required:true
        },
        fraudDetails:{
            type:String,
            required:true
        }
    },
    {timestamps:true}
)

export const Fraud=mongoose.model("Fraud",fraudSchema)