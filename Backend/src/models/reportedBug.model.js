import mongoose, { Schema } from "mongoose";

const reportBugSchema=new Schema(
    {
        email:{
            type:String,
            trim:true,
            required:true
        },
        bugCategory:{
            type:String,
            required:true
        },
        bugTitle:{
            type:String,
            required:true
        },
        bugDescription:{
            type:String,
            required:true
        }
    }
    ,{timestamps:true}
)

export const Bug=mongoose.model("reportedBug",reportBugSchema)