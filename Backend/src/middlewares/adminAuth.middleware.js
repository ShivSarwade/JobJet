import { Admin } from "../models/admin.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from 'jsonwebtoken'
export const verifyJWT=asyncHandler(async(req,res,next)=>{
    try {
        let token;

        if (req.cookies && req.cookies.accessToken) {
            token = req.cookies.accessToken;
        } 
        else if (req.header("Authorization")) 
        {
            token = req.header("Authorization").replace("Bearer ", "");
        }
        if (!token) {
            throw new ApiError(401,"Unauthorized request")
        }
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        const admin = await Admin.findById(decodedToken?._id)
            .select("-adminPassword -SecurityKey -refreshToken")

        if (!admin) {

            throw new ApiError(401, "Invalid Access Token")
        }

        req.admin = admin;
        next()
    }
    catch(error)
    {
        throw new ApiError(401,error?.message||"Invalid access token")
    }
})
