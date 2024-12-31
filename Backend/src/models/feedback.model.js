import mongoose, { Schema } from "mongoose";

const feedbackSchema = new Schema(
    {
        email:{
            type:String,
            trim:true,
            required:true
        },
        rating:{
            type:String,
            required:true
        },
        feedbackDescp:{
            type:String,
            required:true
        }
    }, 
    {timestamps:true}
)

export const Feedback=mongoose.model('Feedback',feedbackSchema)