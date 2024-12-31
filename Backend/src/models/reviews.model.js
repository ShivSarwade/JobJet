import mongoose, { Schema } from "mongoose";

const reviewSchema=new Schema(
    {
        email:{
            type:String,
            trim:true,
            required:true
        },
        featureName:{
            type:String,
            required:true
        },
        featureDescription:{
            type:String,
            required:true
        }
    }
,{timestamps:true})

export const Feature=mongoose.model("Feature",reviewSchema)