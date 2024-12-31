import mongoose, { Schema } from "mongoose";

const jobApplicationSchema=new Schema({
    userId:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:true
    },
    jobId:{
        type:mongoose.Schema.ObjectId,
        ref:"JobPost",
        required:true
    },
    resume:{
        type:String,
        required:true
    }
},
{timestamps:true})
export const JobApplication=mongoose.model("JobApplication",jobApplicationSchema)
