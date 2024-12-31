import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { ApiError } from '../utils/ApiError.js'
import { Admin } from '../models/admin.model.js'
import { JobPost } from '../models/jobpost.model.js'
import { User } from '../models/user.model.js'
import {Recruiter} from '../models/recruiter.model.js'
import { JobApplication } from '../models/appliedJob.model.js'
import { deleteFromCloudinary, uploadOnCloudinary } from '../utils/cloudinary.js'
import mongoose from 'mongoose'
const Test=asyncHandler(async(req,res)=>{
    res
    .status(200)
    .json({
        message:"this is for admin routes testing if you not developer why you where ",
        name:req.body
    })
})

const generateAccessAndRefreshToken = async (adminId) => {
    try {
        const admin = await Admin.findById(adminId)
        const accessToken = admin.generateAccessToken()
        const refreshToken = admin.generateRefreshToken()

        admin.refreshToken = refreshToken
        await admin.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }

    } catch (error) {

        throw new ApiError(500, "Something went wrong while generating refresh and access token")
    }
}


const createAdmin=asyncHandler(async(req,res)=>{
    const {firstName,lastName,adminEmail,adminPassword}=req.body
    if (
        [firstName,lastName,adminEmail,adminPassword].some((field) =>
            field?.trim() === "")
    ) 
    {
        throw new ApiError(400, "All fields are required")
    }

    const existingAdmin=await Admin.findOne({adminEmail})

    if(existingAdmin)
    {
        throw new ApiError(409,"Admin with given email already exists")
    }

    const admin=await Admin.create({
        adminUserName:firstName+' '+lastName,
        adminEmail,
        adminPassword,
    })

    const createdAdmin=await Admin.findById(admin._id)
    .select("-adminPassword  -refreshToken")

    if(!createdAdmin)
    {
        throw new ApiError(500,"Error creating admin")
    }

    return res
    .status(200)
    .json(new ApiResponse(201,createdAdmin,"admin has been created successfully"))
})

const loginAdmin=asyncHandler(async(req,res)=>{
    const {email,password}=req.body
    console.log(req.body);
    console.log(email,password);
    

    if(
        [email&&password].some((field) =>
            field?.trim() === "")
    )
    {
        throw new ApiError(300,"all fields are necessary")
    }

    const admin=await Admin.findOne({adminEmail:email})
    console.log(admin);
    

    if(!admin)
    {
        throw new ApiError(400,"Admin does not exists")
    }

    const isPasswordValid=await admin.isPasswordCorrect(password)

    // const isSecurityKeyValid=await admin.isSecurityKeyCorrect(SecurityKey)

    if (!(isPasswordValid)) {
        throw new ApiError(404, "Invalid user details")
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(admin._id)
    
    const loggedInAdmin=await Admin
    .findById(admin._id)
    .select("-adminPassword -SecurityKey -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res.status(200)
    .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(200,
                {
                    admin:loggedInAdmin,accessToken,refreshToken
                }
            )
        )
})

const getCurrentUser=asyncHandler(async(req,res)=>{
    return res
    .status(200)
    .json(new ApiResponse(200,req.admin,'current admin fetched'))
})

const logoutAdmin=asyncHandler(async (req,res)=>{
    await Admin.findByIdAndUpdate(
        req.admin._id,
        {
            $set:{
                refreshToken:undefined
            }
        },
        {
            new:true
        }
    )
    const options = {
        httpOnly: true,
        secure: true
    }
    return res 
    .status(200)
    .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {},"Admin logged out"))
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    {
        const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken
        if (!incomingRefreshToken) {
            throw new ApiError(401, "unauthorized request")
        }

        try {
            const decodedToken = jwt.verify(
                incomingRefreshToken,
                process.env.REFRESH_TOKEN_SECRET
            )
            const admin = await Admin.findById(decodedToken._id)

            if (!admin) {
                throw new ApiError(401, "Invalid refresh token")
            }
            if (incomingRefreshToken !== admin.refreshToken) {
                throw new ApiError(401, "Refresh token is expired or used")
            }
            const options = {
                httpOnly: true,
                secure: true
            }
            const { accessToken, newRefreshToken } = await generateAccessAndRefreshToken(admin._id)

            return res
                .status(200)
                .cookie("accessToken", accessToken, options)
                .cookie("refreshToken", newRefreshToken, options)
                .json(
                    new ApiResponse(
                        200,
                        { accessToken, refreshToken: newRefreshToken },
                        "access token refreshed"
                    )
                )
        }
        catch (error) {
            throw new ApiError(401, error.message||"Invalid RefreshToken")
        }
    }
})
const verifyJobPost=asyncHandler(async(req,res)=>{
    const{jobId}=req.body

    if(!req.admin._id)
    {
        throw new ApiError(500,"admin is not logged in")
    }
    const jobExists = await JobPost.findByIdAndUpdate(jobId,
        {
            $set:{
                isVerified:true
            }
        },//update isVerified
        {
            new:true
        }//return new updated object
    ).select("-adminPassword -SecurityKey -refreshToken")
    if(!jobExists)
    {
        throw new ApiError(404,"The given job post does not exists")
    }

    console.log(jobExists)
    return res
    .status(200)
    .json(new ApiResponse(200,"Jobpost verified successfully "))
})
const getStats=asyncHandler(async(req,res)=>{
    const recruiterCount=await Recruiter.countDocuments()

    
    const userCount=await User.countDocuments()
    const jobPostCount =await JobPost.countDocuments()
    

    const stats=(recruiterCount,userCount,jobPostCount)
    console.log(recruiterCount,userCount,jobPostCount);

    return res
    .status(200)
    .json(new ApiResponse(202,[userCount,recruiterCount,jobPostCount],"recruiters fetched"))


})
const getRecruiterCount=asyncHandler(async(req,res)=>{
    const recruiterCount=await Recruiter.aggregate([
        {
            $count:"total recruiters"
        }
    ])
   

    return res
    .status(200)
    .json(new ApiResponse(202,recruiterCount[0],"recruiters fetched"))

})
const getUserCount=asyncHandler(async(req,res)=>{
    const userCount=await User.aggregate([
        {
            $count:"total users"
        }
    ])

    return res
    .status(200)
    .json(new ApiResponse(202,userCount[0],"users fetched"))
})
const getRecruiterInfo=asyncHandler(async(req,res)=>{
 
    
    const recruiters=await Recruiter.find({rBasicProfileComplete:true,rVerificationStatus:"pending"}).select("rUserName rCompanyName rLocation rEmail rPhoneNo rWebsite rFoundingYear rEmployeeCount avatar rVerificationStatus rBasicProfileComplete")

    return res
    .status(200)
    .json(new ApiResponse(202,recruiters,"total jobposts fetched"))
})
const updateAdminDetails=asyncHandler(async(req,res)=>{
    const{adminFirstName,adminLastName,adminEmail}=req.body

    if (!req.admin._id) {
        throw new ApiError(404, "admin id not found")
    }
    // const adminId = await Admin.findById(req.admin._id)

    // if (!adminId) {
    //     throw new ApiError(400, "admin does not exists")
    // }

    const adminUserName = (adminFirstName && adminLastName) ? adminFirstName + '-' + adminLastName : req.admin.adminUserName

    const admin = await Admin.findByIdAndUpdate(req.admin._id,
        {
            $set: {
                adminEmail,
                adminUserName,
            }
        },
        {
            new: true
        }
    ).select("-adminPassword -SecurityKey -refreshToken")


    return res
        .status(200)
        .json(new ApiResponse(200, admin, "admin updated successfully"))
})
const uploadAdminAvatar=asyncHandler(async(req,res)=>{

    if(!req.file)
    {
        throw new ApiError(400,"File not found")
    }

   const avatarLocalPath=req.file.path
   
    if(!avatarLocalPath)
    {
        throw new ApiError(404,"avatar image is missing ")
    }
    const avatar=await uploadOnCloudinary(avatarLocalPath)

    if(!avatar.url)
    {
        throw new ApiError(400,"Error while uploading admin avatar")
    }
    const existingUser=await Admin.findById(req.admin._id)

    if(!existingUser)
    {
        throw new ApiError(404,"admin not found")
    }
    let existingAvatar
    if(existingUser.adminAvatar)
    {
        existingAvatar=existingUser.adminAvatar.slice(61,existingUser.adminAvatar.length-4)
        console.log(existingAvatar);
    }

    const admin=await Admin.findByIdAndUpdate(
        req.admin._id,
        {
            $set:{
                adminAvatar:avatar.url
            }
        },
        {
            new:true
        }
    ).select("-adminPassword -SecurityKey -refreshToken")


    if(existingAvatar)
    {
        const deletedFile=await deleteFromCloudinary(existingAvatar)
        console.log(deletedFile);
        
        return res
        .status(200)
        .json(new ApiResponse(200,deletedFile,"admin avatar updated successfully"))
    }

    return res
    .status(200)
    .json(new ApiResponse(200,admin,"avatar uploaded successfully at public url"))
})
const getAllJobApplicationsForAdmin = asyncHandler(async (req, res) => {
    const { jobId, recruiterusername } = req.body;
    const recruiterId = await Recruiter.findOne({rUserName:recruiterusername})
    const jobpost = await JobPost.findOne({
      _id: jobId,
      jobPostCompany: recruiterId,
    });
  
    if (!jobpost) {
      throw new ApiError(
        400,
        "The job post not found. Please ensure providing correct details"
      );
    }
  
    const jobPostSkills = jobpost.jobPostSkill || []; // Assuming `skills` is an array in `JobPost`
  
    const jobApplications = await JobApplication.aggregate([
      {
        $match: {
          jobId: new mongoose.Types.ObjectId(jobId),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $addFields: {
          // Convert both jobPostSkills and user.skills to lowercase arrays
          lowerCaseUserSkills: {
            $map: {
              input: "$user.skills",
              as: "skill",
              in: { $toLower: "$$skill" },
            },
          },
          lowerCaseJobPostSkills: {
            $map: {
              input:  jobPostSkills,
              as: "skill",
              in: { $toLower: "$$skill" },
            },
          },
        },
      },
      {
        $addFields: {
          matchingSkills: {
            $size: {
              $setIntersection: ["$lowerCaseUserSkills", "$lowerCaseJobPostSkills"],
            },
          },
        },
      },
      {
        $sort: {
          matchingSkills: -1,
        },
      },
      {
        $project: {
          _id: 1,
          jobId: 1,
          userId: 1,
          matchingSkills: 1, // Include the count of matching skills
          user: {
            _id: "$user._id",
            firstName:1,
            lastName:1,
            username: "$user.username",
            email: "$user.email",
            avatar: "$user.avatar",
            banner: "$user.banner",
            skills: "$user.skills",
          },
        },
      },
    ]);
  
    return res
      .status(200)
      .json(new ApiResponse(200, {job:jobpost,applications:jobApplications}, "Jobs fetched"));
  });
  
const verifyRecruiter=asyncHandler(async(req,res)=>{
    console.log(req.body)
    const{recruiterId,verificationStatus}=req.body
    let basicProfileComplete =true
    if(!req.admin._id)
    {
        throw new ApiError(500,"admin is not logged in")
    }
    if(!recruiterId || !verificationStatus){
        throw new ApiError(400,"Provide all required data")
    }
    console.log(verificationStatus=="verified")
    if(verificationStatus=="rejected"){
        basicProfileComplete=false
    }
    else{
        basicProfileComplete=true
    }
    const updatedRecruiter = await Recruiter.findByIdAndUpdate(recruiterId,
        {
            $set:{
                rVerificationStatus:verificationStatus,
                rBasicProfileComplete:basicProfileComplete,
            }
        },//update isVerified
        {
            new:true
        }//return new updated object
    ).select("rUserName rCompanyName rVerificationStatus rBasicProfileComplete")
    if(!updatedRecruiter)
    {
        throw new ApiError(404,"The given job post does not exists")
    }

    console.log(updatedRecruiter)
    return res
    .status(200)
    .json(new ApiResponse(200,"Jobpost verified successfully "))
})


export {
    Test,
    generateAccessAndRefreshToken,
    createAdmin,
    loginAdmin,
    getCurrentUser,
    logoutAdmin,
    refreshAccessToken,
    verifyJobPost,
    getRecruiterCount,
    getUserCount,
    getStats,
    getRecruiterInfo,
    updateAdminDetails,
    uploadAdminAvatar,
    getAllJobApplicationsForAdmin,
    verifyRecruiter

}