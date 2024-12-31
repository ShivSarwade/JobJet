import { application } from "express";
import { JobApplication } from "../models/appliedJob.model.js";
import { JobPost } from "../models/jobpost.model.js";
import { Recruiter } from "../models/recruiter.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import mongoose from "mongoose";
// Fetch job posts by recruiter username
const getJobPostByRecruiterUsername = asyncHandler(async (req, res) => {
  const { rUserName } = req.params;
  let { count, page } = req.query;

  const recruiter = await Recruiter.findOne({ rUserName }).select(
    "rCompanyName avatar _id"
  );

  if (!recruiter) {
    throw new ApiError(404, "Recruiter not found");
  }

  count = Math.max(parseInt(count) || 10, 1);
  page = Math.max(parseInt(page) || 1, 1);

  const limit = count;
  const skip = (page - 1) * limit;

  const jobPosts = await JobPost.aggregate([
    {
      $match: {
        jobPostCompany: recruiter._id,
      },
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
      $sort: {
        createdAt: -1,
      },
    },
    {
      $unwind: "$jobPostCompany",
    },
    {
      $project: {
        _id: 1,
        jobPostName: 1,
        jobPostAddress: 1,
        jobPostCompany: {
          _id: "$jobPostCompany._id",
          rUserName: "$jobPostCompany.rUserName",
          rCompanyName: "$jobPostCompany.rCompanyName",
          avatar: "$jobPostCompany.avatar",
        },
      },
    },
    {
      $skip: skip,
    },
    {
      $limit: limit,
    },
  ]);

  const totalJobs = await JobPost.countDocuments({
    jobPostCompany: recruiter._id,
  });

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { jobPosts, totalJobs },
        "Job posts fetched successfully"
      )
    );
});

// Fetch job post details by job ID

const getJobPostDetailsById = asyncHandler(async (req, res) => {
  const { jobId } = req.params;

  console.log("Received Job ID:", jobId);

  // Check if jobId is valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(jobId)) {
    throw new ApiError(400, "Invalid Job ID format");
  }

  // Fetch job post details by job ID
  const jobPostDetails = await JobPost.findById(jobId).populate(
    "jobPostCompany",
    "rUserName rCompanyName avatar"
  );

  if (!jobPostDetails) {
    throw new ApiError(404, "Job post not found");
  }

  res
    .status(200)
    .json(
      new ApiResponse(200, jobPostDetails, "Job post fetched successfully")
    );
});

const applyJob = asyncHandler(async (req, res) => {
  const { jobId } = req.body;
  const { file } = req;

  if (!file) {
    throw new ApiError(400, "File not found");
  }
  if (!jobId) {
    throw new ApiError(400, "Job ID not found");
  }
  if (!req.user || !req.user._id) {
    throw new ApiError(400, "User ID not found");
  }

  // Check if the user has already applied for the job
  const existingApplication = await JobApplication.findOne({
    userId: req.user._id,
    jobId,
  });

  if (existingApplication) {
    throw new ApiError(400, "You have already applied for this job");
    console.log("existing application");
  }

  const resumeLocalPath = file.path;

  if (!resumeLocalPath) {
    throw new ApiError(400, "Resume file path is missing");
    console.log("resume local path");
  }

  // Upload the file to Cloudinary
  const resume = await uploadOnCloudinary(resumeLocalPath, "raw");

  if (!resume || !resume.url) {
    throw new ApiError(500, "Error while uploading resume to Cloudinary");
  }

  console.log("Resume uploaded successfully:", resume.url);

  // Create a new job application in the database
  const jobApplication = await JobApplication.create({
    userId: req.user._id,
    jobId,
    resume: resume.url,
  });

  res.status(201).json({
    success: true,
    message: "Job application submitted successfully",
    application: jobApplication,
  });
});
const getApplication = asyncHandler(async (req, res) => {
  const { jobId } = req.body;
  console.log(req.body);

  if (!jobId) {
    throw new ApiError(400, "Job Id Not Found");
  }
  if (!req.user || !req.user._id) {
    throw new ApiError(400, "unathorised request");
  }
  const existingApplication = await JobApplication.findOne({
    userId: req.user._id,
    jobId,
  });
  if (!existingApplication) {
    res.status(201).json({
      success: true,
      message: "no Job application has been done by given user",
      application: [],
    });
  }
  res.status(201).json({
    success: true,
    message: "Job application submitted successfully",
    application: existingApplication,
  });
});

const getAppliedJobsByUserID = asyncHandler(async (req, res) => {
  if (!req.user || !req.user._id) {
    throw new ApiError(400, "User is not authorized");
  }

  // Ensure `req.user._id` is an ObjectId

  const jobApplications = await JobApplication.aggregate([
    {
      $match: {
        userId: req.user._id, // Match the user's ID
      },
    },
    {
      $lookup: {
        from: "jobposts", // Use the correct collection name (case-sensitive)
        localField: "jobId", // The field in `JobApplication` referencing `JobPosts`
        foreignField: "_id", // The `_id` field in `JobPosts`
        as: "jobPost", // The alias for the joined data
      },
    },
    {
      $unwind: "$jobPost",
    },
    {
      $sort: {
        createdAt: -1, // Sort by application creation date, descending
      },
    },
    {
      $lookup: {
        from: "recruiters",
        localField: "jobPost.jobPostCompany",
        foreignField: "_id",
        as: "jobPost.jobPostCompany",
      },
    },
    {
      $sort: {
        createdAt: -1,
      },
    },
    {
      $unwind: "$jobPost.jobPostCompany",
    },

    {
      $project: {
        _id: 1, // Include application `_id`
        jobId: 1, // Include `jobId` field from JobApplication
        jobPostName: "$jobPost.jobPostName", // Replace with the correct field in `JobPosts`
        jobPostAddress: "$jobPost.jobPostAddress", // Replace with the correct field in `JobPosts`
        jobPostCompany: {
          _id: "$jobPost.jobPostCompany._id",
          rUserName: "$jobPost.jobPostCompany.rUsername",
          rCompanyName: "$jobPost.jobPostCompany.rCompanyName",
          avatar: "$jobPost.jobPostCompany.avatar",
        },
      },
    },
  ]);

  // Log the result for debugging
  console.log(jobApplications);

  // Return the result
  res.status(200).json(jobApplications);
});

export {
  getJobPostByRecruiterUsername,
  getJobPostDetailsById,
  applyJob,
  getApplication,
  getAppliedJobsByUserID,
};
