import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Recruiter } from "../models/recruiter.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { JobPost } from "../models/jobpost.model.js";
import mongoose, { Mongoose } from "mongoose";
import { JobApplication } from "../models/appliedJob.model.js";
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.js";

const Test = asyncHandler(async (req, res) => {
  console.log(
    res.json({
      message: "this is the test for requirter",
      name: req.body,
    })
  );
});
const generateAccessAndRefreshToken = async (recruiterId) => {
  try {
    const recruiter = await Recruiter.findById(recruiterId);
    const accessToken = recruiter.generateAccessToken();
    const refreshToken = recruiter.generateRefreshToken();

    recruiter.refreshToken = refreshToken;
    await recruiter.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating refresh and access token"
    );
  }
};

const registerRecruiter = asyncHandler(async (req, res) => {
  const { rEmail, rCompanyName, rPassword } = req.body;
  // console.log(`Username:${username} , email:${email} , firstName:${firstName} lastName:${lastName},password${password}`);

  if ([rEmail, rCompanyName, rPassword].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const existingRecruiter = await Recruiter.findOne({ rEmail });
  // console.log(existingUser);

  if (existingRecruiter) {
    throw new ApiError(409, "User with email already exists");
  }

  const recruiter = await Recruiter.create({
    rUserName:
      rCompanyName + "-" + Math.floor(1000000000 + Math.random() * 9000000000),
    rEmail,
    rCompanyName,
    rPassword,
    rHeadline: "",
    rLocation: "",
    rWebsite: "https://jobjet.in",
    rIndustry: "",
    rPhoneNo: 0,
    rFoundingYear: 1999,
    rEmployeeCount: 2,
    rVerificationStatus: "pending",
    rBasicProfileComplete: "false",
  });
  const createdRecruiter = await Recruiter.findOne({ rEmail }).select(
    "-password -refreshToken"
  );
  if (!createdRecruiter) {
    throw new ApiError(500, "Error in registering the recruiter");
  }
  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        createdRecruiter,
        "Recruiter registered Successfully"
      )
    );
});

const loginRecruiter = asyncHandler(async (req, res) => {
  //take Recruiter email and password from the frontend
  //store in a variable
  //call DB to check if the user with given email and password exists
  //if doesnt exists give an error
  //if exists generate access and refresh token
  //send cookies  and send response login successfull

  const { rUserName, rEmail, rPassword } = req.body; //destructuring
  console.log(rEmail);

  if (!(rUserName || rEmail)) {
    throw new ApiError(400, "Recruiter rusername or email is required");
  }

  const recruiter = await Recruiter.findOne({
    $or: [{ rUserName }, { rEmail }],
  }); //check DB for recruiter

  if (!recruiter) {
    throw new ApiError(404, "Recruiter does not exists");
  }

  const isPasswordValid = await recruiter.isPasswordCorrect(rPassword);
  if (!isPasswordValid) {
    throw new ApiError(404, "Invalid recruiter details");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    recruiter._id
  );

  const loggedInRecruiter = await Recruiter.findById(recruiter._id).select(
    "-rPassword -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };
  const { _doc } = loggedInRecruiter;
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          ..._doc,
          accessToken,
          refreshToken,
        },
        "Recruiter LoggedIn successfully"
      )
    );
});

const logoutRecruiter = asyncHandler(async (req, res) => {
  //takes cookies from the frontend
  //find recruiter with the id
  //clear the value of the refresh token from the database
  //clear the cookies
  // send a appropriate a json response
  const request = req.recruiter._id;
  console.log(request);

  await Recruiter.findByIdAndUpdate(
    req.recruiter._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );
  const options = {
    httpOnly: true,
    secure: true,
  };
  console.log(req.recruiter);
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "Recruiter has Logged out "));
});
const refreshAccessToken = asyncHandler(async (req, res) => {
  {
    const incomingRefreshToken =
      req.cookies.refreshToken || req.body.refreshToken;
    if (!incomingRefreshToken) {
      throw new ApiError(401, "unauthorized request");
    }

    try {
      const decodedToken = jwt.verify(
        incomingRefreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );
      const user = await Recruiter.findById(decodedToken._id);

      if (!user) {
        throw new ApiError(401, "Invalid refresh token");
      }
      if (incomingRefreshToken !== user.refreshToken) {
        throw new ApiError(401, "Refresh token is expired or used");
      }
      const options = {
        httpOnly: true,
        secure: true,
      };
      const { accessToken, newRefreshToken } =
        await generateAccessAndRefreshToken(user._id);

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
        );
    } catch (error) {
      throw new ApiError(401, error.message || "Invalid RefreshToken");
    }
  }
});

const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  // let user_id
  if (!req.body._id) {
    throw new ApiError(400, "id not found");
  }
  const recruiter_id = req.body._id;
  const recruiter = await Recruiter.findById(recruiter_id);
  const isPasswordCorrect = await recruiter.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(406, "Invalid old password");
  }

  recruiter.rPassword = newPassword;

  await recruiter.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"));
});

const getCurrentRecruiter = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.recruiter, "Current Recruiter fetched"));
});

const getRecruiterProfile = asyncHandler(async (req, res) => {
  const { rUserName } = req.body; // Extracting rUserName from the body

  console.log("request bocy", req.body);

  if (rUserName) {
    // Await the query to ensure the profile is fetched properly
    const recruiterProfile = await Recruiter.findOne({ rUserName }).select(
      "-rPassword -rEmail -refreshToken"
    );

    if (recruiterProfile) {
      // If recruiter profile is found, return success response
      return res
        .status(200)
        .json(
          new ApiResponse(200, recruiterProfile, "Recruiter Found Successfully")
        );
    } else {
      // If recruiter profile is not found, throw a 404 error
      throw new ApiError(404, "Recruiter Not Found");
    }
  } else {
    // If rUserName is missing in the body, throw a 404 error
    throw new ApiError(404, "recruiter username of recruiter not found");
  }
});

const updateRecruiterPersonalDetails = asyncHandler(async (req, res) => {
  const { rEmail, rPhoneNo, rCompanyName } = req.body;

  // Ensure recruiter ID is provided in the request body
  if (!req.body._id) {
    // Use req.recruiter._id if that's your intended logic after testing
    throw new ApiError(400, "Recruiter ID not provided");
  }

  const recruiter_id = req.body._id; // Change this to req.recruiter._id after testing

  // Validate required fields (rEmail, rPhoneNo, rCompanyName)
  if (!rEmail || !rPhoneNo || !rCompanyName) {
    throw new ApiError(
      400,
      "Email, phone number, and company name are required"
    );
  }

  // Attempt to update the recruiter's details
  const recruiter = await Recruiter.findByIdAndUpdate(
    recruiter_id,
    {
      $set: {
        rEmail,
        rPhoneNo,
        rCompanyName,
      },
    },
    {
      new: true, // Returns the updated recruiter document
    }
  ).select("-rPassword -refreshToken"); // Exclude sensitive fields

  // Handle case where recruiter is not found
  if (!recruiter) {
    throw new ApiError(
      404,
      "Recruiter not found, update could not be performed"
    );
  }

  // Successfully return the updated recruiter details
  return res
    .status(200)
    .json(
      new ApiResponse(200, recruiter, "Recruiter info updated successfully")
    );
});

const updateRecruiterOverview = asyncHandler(async (req, res) => {
  console.log(req.body);

  // Log request body, but avoid logging sensitive data (e.g., companyOverview)
  console.log("Received update request:", {
    _id: req.body._id,
    companyOverview: req.body.companyOverview ? "[PROVIDED]" : "[NOT PROVIDED]",
  });

  const { _id, companyOverview } = req.body;
  console.log(_id, companyOverview);

  // Validation check
  if (!companyOverview || !_id) {
    throw new ApiError(
      400,
      "Both recruiter ID and overview details are required"
    );
  }

  try {
    // Update recruiter details
    const recruiter = await Recruiter.findByIdAndUpdate(
      _id,
      {
        $set: {
          rOverview: companyOverview,
        },
      },
      {
        new: true, // Returns the updated recruiter document
      }
    ).select("-rPassword -refreshToken"); // Exclude sensitive fields

    // Check if recruiter exists
    if (!recruiter) {
      throw new ApiError(
        404,
        "Recruiter not found, update could not be performed"
      );
    }

    // Return success response
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          recruiter,
          "Recruiter information updated successfully"
        )
      );
  } catch (error) {
    // Catch any unexpected errors and rethrow with ApiError for consistency
    throw new ApiError(
      500,
      error.message || "An error occurred while updating recruiter"
    );
  }
});

const uploadBanner = asyncHandler(async (req, res) => {
  // Check if file is present
  if (!req.file || !req.file.path) {
    throw new ApiError(400, "File not found or path is missing");
  }

  const bannerLocalPath = req.file.path;

  // Upload to Cloudinary
  const banner = await uploadOnCloudinary(bannerLocalPath);

  // Validate the uploaded banner
  if (!banner || !banner.url) {
    throw new ApiError(400, "Error while uploading banner");
  }

  // Find existing recruiter
  const existingRecruiter = await Recruiter.findById(req.recruiter._id);

  if (!existingRecruiter) {
    throw new ApiError(400, "Recruiter not found");
  }

  // Store the previous avatar URL for deletion
  const previousBannerUrl = existingRecruiter.banner;

  // Update recruiter with new avatar
  const updatedRecruiter = await Recruiter.findByIdAndUpdate(
    req.recruiter._id,
    { $set: { banner: banner.url } },
    { new: true }
  ).select("-password -refreshToken");

  // Delete the old avatar if it exists
  if (previousBannerUrl) {
    const publicId = previousBannerUrl.split("/").pop().split(".")[0]; // Get the public ID
    await deleteFromCloudinary(publicId); // Pass the public ID to delete
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedRecruiter, "Banner uploaded successfully")
    );
});
const uploadAvatar = asyncHandler(async (req, res) => {
  console.log(req.recruiter);
  console.log(req.file);
  // Check if file is present
  if (!req.file || !req.file.path) {
    throw new ApiError(400, "File not found or path is missing");
  }

  const avatarLocalPath = req.file.path;

  // Upload to Cloudinary
  const avatar = await uploadOnCloudinary(avatarLocalPath);

  // Validate the uploaded avatar
  if (!avatar || !avatar.url) {
    throw new ApiError(400, "Error while uploading avatar");
  }

  // Find existing recruiter
  const existingAvatar = await Recruiter.findById(req.recruiter._id);

  if (!existingAvatar) {
    throw new ApiError(400, "Recruiter not found");
  }

  // Store the previous avatar URL for deletion
  const previousAvatarUrl = existingAvatar.avatar;

  // Update recruiter with new avatar
  const updatedRecruiter = await Recruiter.findByIdAndUpdate(
    req.recruiter._id,
    { $set: { avatar: avatar.url } },
    { new: true }
  ).select("-password -refreshToken");

  // Delete the old avatar if it exists
  if (previousAvatarUrl) {
    const publicId = previousAvatarUrl.split("/").pop().split(".")[0]; // Get the public ID
    await deleteFromCloudinary(publicId); // Pass the public ID to delete
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedRecruiter, "Avatar uploaded successfully")
    );
});

const editProfileIntro = asyncHandler(async (req, res) => {
  const {
    rCompanyName,
    rHeadline,
    rLocation,
    rWebsite,
    rIndustry,
    rPhoneNo,
    rFoundingYear,
    rEmployeeCount,
  } = req.body;

  // Get the recruiter ID from req.recruiter
  const recruiterId = req.recruiter._id;

  // Load the recruiter data using the ID
  const recruiter = await Recruiter.findById(recruiterId);

  if (!recruiter) {
    throw new ApiError(404, "Recruiter not found");
  }

  // Create an object to hold the updates
  const updates = {};

  // Check for each field if it's provided and not equal to the current value
  if (rCompanyName && rCompanyName !== recruiter.rCompanyName) {
    updates.rCompanyName = rCompanyName;
  }
  if (rHeadline && rHeadline !== recruiter.rHeadline) {
    updates.rHeadline = rHeadline;
  }
  if (rLocation && rLocation !== recruiter.rLocation) {
    updates.rLocation = rLocation;
  }
  if (rWebsite && rWebsite !== recruiter.rWebsite) {
    updates.rWebsite = rWebsite;
  }
  if (rIndustry && rIndustry !== recruiter.rIndustry) {
    updates.rIndustry = rIndustry;
  }
  if (rPhoneNo && rPhoneNo !== recruiter.rPhoneNo) {
    updates.rPhoneNo = rPhoneNo;
  }
  if (rFoundingYear && rFoundingYear !== recruiter.rFoundingYear) {
    updates.rFoundingYear = rFoundingYear;
  }
  if (rEmployeeCount && rEmployeeCount !== recruiter.rEmployeeCount) {
    updates.rEmployeeCount = rEmployeeCount;
  }

  // If there are updates, apply them to the recruiter using $set
  if (Object.keys(updates).length > 0) {
    try {
      await Recruiter.findByIdAndUpdate(
        recruiterId,
        { $set: updates },
        { new: true }
      );
    } catch (error) {
      throw new ApiError(500, "Error saving updated recruiter data");
    }
  }

  // Reload the updated recruiter document
  const updatedRecruiter = await Recruiter.findById(recruiterId);

  // Check if all required fields are now filled
  const allFieldsFilled = [
    updatedRecruiter.rCompanyName,
    updatedRecruiter.rHeadline,
    updatedRecruiter.rLocation,
    updatedRecruiter.rWebsite,
    updatedRecruiter.rIndustry,
    updatedRecruiter.rPhoneNo,
    updatedRecruiter.rFoundingYear,
    updatedRecruiter.rEmployeeCount,
  ].every((field) => field);

  // If all fields are filled, update the verification status
  if (
    allFieldsFilled &&
    updatedRecruiter.rVerificationStatus != "verified " &&
    updatedRecruiter.rBasicProfileComplete != true
  ) {
    try {
      await Recruiter.findByIdAndUpdate(recruiterId, {
        $set: { rVerificationStatus: "pending", rBasicProfileComplete: true },
      });
    } catch (error) {
      throw new ApiError(500, "Error updating verification status");
    }
  }

  // Reload the updated recruiter to send back in response, excluding sensitive fields
  const finalRecruiter = await Recruiter.findById(recruiterId).select(
    "-rPassword -refreshToken"
  );

  return res.status(200).json({
    message: "Profile updated successfully",
    recruiter: finalRecruiter,
  });
});

const createOrUpdateJobPost = asyncHandler(async (req, res) => {
  const {
    _id,
    jobPostName,
    jobPostDescription,
    jobPostAddress,
    jobPostSkill,
    jobPostType,
    jobPostMinSalary,
    jobPostMaxSalary,
    jobPostMode,
    jobPostLevel,
    jobPostQualification,
    jobPostVacancies,
  } = req.body;

  const jobPostCompany = req.recruiter._id;

  // Log all received values
  console.log({
    _id,
    jobPostName,
    jobPostDescription,
    jobPostAddress,
    jobPostSkill,
    jobPostCompany,
    jobPostType,
    jobPostMinSalary,
    jobPostMaxSalary,
    jobPostMode,
    jobPostLevel,
    jobPostQualification,
    jobPostVacancies,
  });

  // Prepare an object for the fields that can be updated
  const updates = {};

  if (jobPostName) updates.jobPostName = jobPostName;
  if (jobPostDescription) updates.jobPostDescription = jobPostDescription;
  if (jobPostAddress) updates.jobPostAddress = jobPostAddress;
  if (jobPostSkill) updates.jobPostSkill = jobPostSkill;
  if (
    ["fulltime", "parttime", "internship", "contract"].includes(jobPostType)
  ) {
    updates.jobPostType = jobPostType;
  }
  if (jobPostMinSalary >= 0) updates.jobPostMinSalary = jobPostMinSalary;
  if (jobPostMaxSalary >= 0) updates.jobPostMaxSalary = jobPostMaxSalary;
  if (["hybrid", "onsite", "remote"].includes(jobPostMode)) {
    updates.jobPostMode = jobPostMode;
  }
  if (
    ["entry-level", "mid-level", "senior", "lead", "manager"].includes(
      jobPostLevel
    )
  ) {
    updates.jobPostLevel = jobPostLevel;
  }
  if (["bachelor's", "master's", "none"].includes(jobPostQualification)) {
    updates.jobPostQualification = jobPostQualification;
  }
  if (jobPostVacancies >= 1) updates.jobPostVacancies = jobPostVacancies;

  if (_id) {
    // If _id is present, try to find and update the job post
    const existingJobPost = await JobPost.findById(_id);

    if (!existingJobPost) {
      return res.status(404).json({
        success: false,
        message: "Job post not found",
      });
    }

    // Update only the fields that are provided
    Object.assign(existingJobPost, updates);

    // Save the updated job post
    const updatedJobPost = await existingJobPost.save();

    return res.status(200).json({
      success: true,
      message: "Job post updated successfully",
      jobPost: updatedJobPost,
    });
  } else {
    // If _id is not present, create a new job post
    const newJobPost = await JobPost.create({
      ...updates,
      jobPostCompany, // Include the company ID
    });

    return res.status(201).json({
      success: true,
      message: "Job post created successfully",
      jobPost: newJobPost,
    });
  }
});

const alterJobPostActivation = asyncHandler(async (req, res) => {
  const { _id } = req.body; // Destructuring the job ID from the request body
  console.log("Received Job ID:", _id); // Log the received _id

  // Check if _id is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    throw new ApiError(400, "Invalid Job ID format");
  }

  // Find the existing job post by _id
  const existingJobPost = await JobPost.findById(_id);

  if (!existingJobPost) {
    throw new ApiError(400, "Job Post not Found");
  }

  // Toggle the activation status (isActive)
  const updatedJobPost = await JobPost.findByIdAndUpdate(
    _id,
    { isActive: !existingJobPost.isActive }, // Toggle isActive status
    { new: true } // Return the updated document
  );

  // Send the updated job post as a response
  res.status(200).json({
    message: `Job post ${
      updatedJobPost.isActive ? "activated" : "deactivated"
    }`,
    jobPost: updatedJobPost,
  });
});

const deleteJobPost = asyncHandler(async (req, res) => {
  const { _id } = req.body; // Destructuring the job ID from the request body
  console.log("Received Job ID:", _id); // Log the received _id

  // Check if _id is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    throw new ApiError(400, "Invalid Job ID format");
  }
  const deletedPost = await JobPost.findByIdAndDelete(_id);
  console.log(deletedPost);

  if (!deletedPost) {
    throw new ApiError(400, "Job Post Could not be found");
  }
  return res
    .status(200)
    .json({ message: "Job post deleted successfully", deletedPost });
});
const getAllJobApplicationsForRecruiter = asyncHandler(async (req, res) => {
  const { jobId, recruiterusername } = req.body;
  console.log(recruiterusername);
  if (recruiterusername != req.recruiter.rUserName) {
    throw new ApiError(
      400,
      "You can't check the applications of another recruiter"
    );
  }
  const recruiterId = req.recruiter._id;
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
            input: jobPostSkills,
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
            $setIntersection: [
              "$lowerCaseUserSkills",
              "$lowerCaseJobPostSkills",
            ],
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
        resume: 1,
        userId: 1,
        matchingSkills: 1, // Include the count of matching skills
        user: {
          _id: "$user._id",
          firstName: 1,
          lastName: 1,
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
    .json(
      new ApiResponse(
        200,
        { job: jobpost, applications: jobApplications },
        "Jobs fetched"
      )
    );
});

export {
  Test,
  registerRecruiter,
  loginRecruiter,
  logoutRecruiter,
  refreshAccessToken,
  changePassword,
  getCurrentRecruiter,
  getRecruiterProfile,
  updateRecruiterPersonalDetails,
  updateRecruiterOverview,
  uploadBanner,
  uploadAvatar,
  editProfileIntro,
  createOrUpdateJobPost,
  alterJobPostActivation,
  deleteJobPost,
  getAllJobApplicationsForRecruiter,
};
