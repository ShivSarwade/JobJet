import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Feature } from "../models/reviews.model.js";
import { Bug } from "../models/reportedBug.model.js";
import { Fraud } from "../models/reportedFraud.model.js";
import { Feedback } from "../models/feedback.model.js";
import { JobPost } from "../models/jobpost.model.js";

const Test = asyncHandler(async (req, res) => {
  res.status(200).json({
    message: "this is for misc controller",
    name: req.body,
  });
});

const requestfeature = asyncHandler(async (req, res) => {
  const { email, featureName, featureDescription } = req.body;
  console.log(req.body);

  const review = await Feature.create({
    email,
    featureName,
    featureDescription,
  });

  if (!review) {
    throw new ApiError(500, "Error in posting feature request");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "request sent successfully"));
});
const getAllFeatures = asyncHandler(async (req, res) => {
  const featuresList = await Feature.find({});

  if (!featuresList) {
    throw new ApiError(404, "no requested features found");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(
        201,
        featuresList,
        "requested features fetched successfully"
      )
    );
});

const reportBug = asyncHandler(async (req, res) => {
  const { email, bugCategory, bugTitle, bugDescription } = req.body;
  console.log(req.body);

  const bug = await Bug.create({
    email,
    bugCategory,
    bugTitle,
    bugDescription,
  });

  if (!bug) {
    throw new ApiError(500, "bug report cannot be submitted");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, "bug report submitted successfully"));
});

const reportFraud = asyncHandler(async (req, res) => {
  const { email, jobId, jobTitle, companyName, fraudDetails } = req.body;
  console.log(req.body);

  const fraud = Fraud.create({
    email,

    jobTitle,
    companyName,
    fraudDetails,
  });

  if (!fraud) {
    throw new ApiError(500, "fraud report cannot be sent due to server issue");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, fraud, "fraud report sent successfully "));
});

const feedbackAndRate = asyncHandler(async (req, res) => {
  const { email, rating, feedback } = req.body;
  console.log(req.body);

  const feedbackRes = Feedback.create({
    email,
    rating,
    feedbackDescp: feedback,
  });

  if (!feedbackRes) {
    throw new ApiError(500, "feedback cannot be sent due to server issue ");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, feedbackRes, "feedback sent successfully"));
});
const changePassword = asyncHandler(async (req, res) => {
  const { Email, Password } = req.body;

  let user_id;
  if (req.user) {
    user_id = req.user._id;
  }

  const user = await User.findOne({ email: Email });
  // const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  // if (!isPasswordCorrect) {
  //   throw new ApiError(400, "Invalid old password");
  // }
  // console.log(user);
  if (!user) {
    const recruiter = await Recruiter.findOne({ rEmail: Email });

    recruiter.rPassword = Password;
    await recruiter.save({ validateBeforeSave: false });
    return res
      .status(200)
      .json(
        new ApiResponse(200, {}, "recruiter password chnaged successfully")
      );
  }

  user.password = Password;
  await user.save({ validateBeforeSave: false });
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "user password changed successfully"));
});
const searchJob = asyncHandler(async (req, res) => {
  const { title, location } = req.body;
  let { count, page } = req.query;

  count = Math.max(parseInt(count) || 10, 1);
  page = Math.max(parseInt(page) || 1, 1);

  const limit = count;
  const skip = (page - 1) * limit;

  const matchConditions = {isActive:true};
  if (title) {  
    matchConditions.jobPostName = title;
  }
  if (location) {
    matchConditions.jobPostAddress = location;
  }

  const jobPosts = await JobPost.aggregate([
    {
      $match: matchConditions, // Dynamically match title and/or location
    },
    {
      $lookup: {
        from: "recruiters",
        localField: "jobPostCompany",
        foreignField: "_id",
        as: "jobPostCompany",
      },
    },
    {
      $unwind: "$jobPostCompany",
    },
    {
      $match: {
        "jobPostCompany.rVerificationStatus": { $in: ["pending", "verified"] },
      },
    },
    {
      $sort:{
        createdAt:-1,
      }
    },
    {
      $project: {
        _id: 1,
        jobPostName: 1,
        jobPostAddress: 1,
        jobPostCompany: {
          _id: "$jobPostCompany._id",
          avatar: "$jobPostCompany.avatar",
          banner: "$jobPostCompany.banner",
          rUserName: "$jobPostCompany.rUserName",
          rCompanyName: "$jobPostCompany.rCompanyName",
        },
      },
    },
    {
      $sort: {
        createdAt: -1, // Optional sorting by createdAt, if it exists
      },
    },
    {
      $skip: skip,
    },
    {
      $limit: limit,
    },
  ]);

  const totalJobs = await JobPost.countDocuments(matchConditions);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { jobPosts, totalJobs },
        "Jobs fetched successfully"
      )
    );
});

export {
  Test,
  requestfeature,
  getAllFeatures,
  reportBug,
  reportFraud,
  feedbackAndRate,
  changePassword,
  searchJob,
};
