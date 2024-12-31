// import {  } from "../models/user.model.js";
import { Recruiter } from "../models/recruiter.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

export const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        console.log(req.cookies)
        console.log(req.file)
        console.log(req.body);
        
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer", "")

        if (!token) {
            throw new ApiError(401,"Unauthorized request")
        }
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        const recruiter = await Recruiter.findById(decodedToken?._id)
            .select("-rPassword -refreshToken")
        if (!recruiter) {

            throw new ApiError(401, "Invalid Access Token")
        }
        req.recruiter = recruiter;
        next()
    }
    catch(error)
    {
        throw new ApiError(401,error?.message||"Invalid access token")
    }
    // const accessToken=req.cookies
    // const header=req.header("Authorization")
    // if(!accessToken)
    // {
    //     throw new ApiError
    // }
    // if(header)
    // {
    //     header.replace("Bearer","")
    // }
})