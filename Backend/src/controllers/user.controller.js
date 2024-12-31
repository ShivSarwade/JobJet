import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
// import {upload} from "../middlewares/multer.middleware.js"
import { deleteFromCloudinary } from "../utils/cloudinary.js";
import Mongoose from "mongoose";
const Test = asyncHandler(async (req, res) => {
  res.status(200).json({
    message:
      "this is for user routes testing if you not developer why you where ",
    name: req.body,
  });
});

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating refresh and access token"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { email, firstName, lastName, password } = req.body;
  console.log(req.body);

  if (
    [email, firstName, lastName, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ApiError(409, "User with email already exists");
  }

  const user = await User.create({
    username:
      firstName +
      "-" +
      lastName +
      Math.floor(1000000000 + Math.random() * 9000000000),
    email,
    firstName,
    lastName,
    password,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Error in registering the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User registered successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;

  if (!(username || email)) {
    throw new ApiError(400, "username or email is required");
  }

  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(404, "Invalid user details");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User LoggedIn successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  //takes cookies from frontend
  await User.findByIdAndUpdate(
    req.user._id,
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
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User Logged out "));
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
      const user = await User.findById(decodedToken._id);

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
  const { oldPasword, newPassword } = req.body;

  let user_id;
  if (req.user) {
    user_id = req.user._id;
  }

  const user = await User.findById(user_id);
  const isPasswordCorrect = await user.isPasswordCorrect(oldPasword);

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Invalid old password");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "password chnaged successfully"));
});
const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "Current user fetched"));
});

const getUser = asyncHandler(async (req, res) => {
  console.log(req.body);

  const username = req.body.username;

  if (!username) {
    throw new ApiError(400, "No username is provided");
  }

  const user = await User.findOne({ username: username }).select(
    "-password -refreshToken -phoneNo"
  );

  if (user) {
    return res
      .status(200)
      .json(new ApiResponse(200, user, "User Found Successfully"));
  } else {
    throw new ApiError(404, "User Not Found");
  }
});

const updateAccountDetails = asyncHandler(async (req, res) => {
  const { file } = req; // Multer provides the uploaded file in `req.file`
  const { firstName, lastName, age, location, phoneNo, headline } = req.body;

  if (!req.user?._id) {
    throw new ApiError(400, "User ID not provided.");
  }

  const user_id = req.user._id;

  // Step 1: Handle resume upload if `file` is provided
  let resume;
  if (file) {
    const resumeLocalPath = file.path;

    if (!resumeLocalPath) {
      throw new ApiError(400, "Resume file is missing.");
    }
    const deletePreviousFile = await User.findById(req.user._id);

    if (deletePreviousFile.avatar) {
      const fileurl = deletePreviousFile.resume.split("/").pop().split(".")[0];
      const deletedfile = await deleteFromCloudinary(fileurl);
    }
    // Upload the file to Cloudinary
    resume = await uploadOnCloudinary(resumeLocalPath, "raw");

    if (!resume.url) {
      throw new ApiError(400, "Error while uploading resume to Cloudinary.");
    }

    console.log("Resume uploaded successfully:", resume.url);

    // Step 2: Delete previous resume if it exists
    const previousUserData = await User.findById(user_id);

    if (previousUserData.resume) {
      const previousFileName = previousUserData.resume
        .split("/")
        .pop()
        .split(".")[0];
      await deleteFromCloudinary(previousFileName);
    }
  }

  // Step 3: Prepare the updated data (excluding username and email)
  const updatedData = {
    firstName,
    lastName,
    location,
    phoneNo,
    age,
    headline,
    basicProfileComplete: true,
  };

  // Include the new resume URL if it was uploaded
  if (resume?.url) {
    updatedData.resume = resume.url;
  }

  console.log("Updated Data:", updatedData);

  // Step 4: Update the user in the database
  const user = await User.findByIdAndUpdate(
    user_id,
    { $set: updatedData },
    { new: true } // Return the updated document
  ).select("-password -refreshToken"); // Exclude sensitive fields

  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  // Step 5: Return the updated user data
  return res
    .status(200)
    .json(new ApiResponse(200, user, "User info updated successfully."));
});

const updateUserOverview = asyncHandler(async (req, res) => {
  const { about } = req.body;

  try {
    const user = await User.findOneAndUpdate(
      req.user._id,
      {
        $set: {
          about,
        },
      },
      {
        new: true,
      }
    ).select("-password -refreshToken");

    if (!user) {
      throw new ApiError(404, "user not found");
    }
    return res
      .status(200)
      .json(new ApiResponse(200, user, "user overview updated successfully"));
  } catch (error) {
    throw new ApiError(
      500,
      error.message || "error while updating user overview"
    );
  }
});

const updateUserAvatar = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, "File not found");
  }
  const avatarLocalPath = req.file.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar File is missing");
  }
  const avatar = await uploadOnCloudinary(avatarLocalPath);

  if (!avatar.url) {
    throw new ApiError(400, "Error while updating avatar");
  }
  const deletePreviousFile = await User.findById(req.user._id);
  console.log(deletePreviousFile);

  if (deletePreviousFile.avatar) {
    const fileurl = deletePreviousFile.avatar.split("/").pop().split(".")[0];
    const deletedfile = await deleteFromCloudinary(fileurl);
  }
  const updatedUser = await User.findByIdAndUpdate(
    req.user._id, //change back to req.user._id
    {
      $set: {
        avatar: avatar.url,
      },
    }
  ).select("-password -refreshToken");

  return res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "avatar uploded successfully"));
});
const updateUserBanner = asyncHandler(async (req, res) => {
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

  const existingUser = await User.findById(req.user._id);

  if (!existingUser) {
    throw new ApiError(400, "User not found");
  }

  const previousBannerUrl = existingUser.banner;

  // Update user with new banner URL
  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    { $set: { banner: banner.url } }, // Set the new banner URL
    { new: true } // Return the updated document
  ).select("-password -refreshToken");

  // Delete previous banner from Cloudinary if exists
  if (previousBannerUrl) {
    const publicId = previousBannerUrl.split("/").pop().split(".")[0];
    await deleteFromCloudinary(publicId);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "Banner updated successfully"));
});

const searchJob = asyncHandler(async (req, res) => {
  const { jobPostFullName, jobPostCity } = req.param;
  const availableJobs = await User.aggregate([
    {
      $match: {
        jobPostFullName: jobPostFullName,
      },
    }, //pipeline one
    {
      $lookup: {
        from: "JobPosts",
        localField: "_id",
        foreignField: "jobPostFullName",
        as: "",
      },
    },
  ]);
});

//getskills
const getskills = asyncHandler(async (req, res) => {
  const username = req.body.username;

  if (!username) {
    throw new ApiError(400, "No username is provided");
  }
  const user = await User.findOne({ username: username }).select(
    "-password -refreshToken -phoneNo -resume -avatar -address"
  );

  if (!user) {
    throw new ApiError(404, "user not found");
  }

  const newSkills = user.skills;

  return res
    .status(200)
    .json(new ApiResponse(200, newSkills, "current user skills fetched"));
});
//updateskills
const updateSkills = asyncHandler(async (req, res) => {
  const { newSkills } = req.body;
  // const toBeRemoved="User skills not assigned"

  const user = await User.findOneAndUpdate(
    req.user._id,
    {
      $set: { skills: newSkills },
    },
    { new: true }
  ).select("-password -refreshToken -phoneNo -resume -avatar -address");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "user skills added successfully"));
});
const addExperience = asyncHandler(async (req, res) => {
  const { _id, companyName, role, from, to, description, present } = req.body;

  // Create a new experience object
  const newExperience = {
    companyName: companyName || "",
    role: role || "",
    from: from ? new Date(from) : null,
    to: to ? new Date(to) : null,
    description: description || "",
    present: present || false,
  };

  // Basic validation
  if (!companyName || !role || !from) {
    throw new ApiError(
      400,
      "Company name, role, and 'from' date are required."
    );
  }

  if (!present && (!to || new Date(to) < new Date(from))) {
    throw new ApiError(
      400,
      "'To' date must be greater than 'From' date if not a present job."
    );
  }

  // Ensure user is logged in
  if (!req.user || !req.user._id) {
    throw new ApiError(401, "User is not logged in.");
  }

  // Find the user
  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  // Check if _id is provided and if it matches an existing experience
  if (_id) {
    // Find the experience with the given _id
    const experienceIndex = user.experience.findIndex(
      (exp) => exp._id.toString() === _id
    );

    // If experience is not found, return error
    if (experienceIndex === -1) {
      throw new ApiError(408, "Experience not found or does not match.");
    }

    // If experience exists, update it
    user.experience[experienceIndex] = {
      ...user.experience[experienceIndex],
      companyName: newExperience.companyName,
      role: newExperience.role,
      from: newExperience.from,
      to: newExperience.to,
      description: newExperience.description,
      present: newExperience.present,
    };

    // Return the updated experience
    return res.status(200).json({
      status: "success",
      message: "Experience updated successfully.",
      experience: user.experience, // Return updated experience array
    });
  }

  // Check for duplicate experience (if no _id is provided, treat as add new)
  const experienceExists = user.experience.some(
    (exp) =>
      exp.companyName === newExperience.companyName &&
      exp.role === newExperience.role &&
      exp.from.getTime() === newExperience.from.getTime() &&
      ((exp.present && newExperience.present) ||
        exp.to?.getTime() === newExperience.to?.getTime())
  );

  if (experienceExists) {
    throw new ApiError(409, "Experience record already exists.");
  }

  // Add the new experience to the user's experience array
  user.experience.push(newExperience);

  // Sort the experiences: present jobs first, then by 'from' date descending
  user.experience.sort((a, b) => {
    if (a.present && !b.present) return -1;
    if (!a.present && b.present) return 1;
    return new Date(b.from) - new Date(a.from);
  });

  // Save the updated user
  const updatedUser = await user.save();

  // Return the updated experience array
  return res.status(200).json({
    status: "success",
    message: "Experience added successfully.",
    experience: updatedUser.experience, // Return the sorted experience array
  });
});

// removeExprenice
const removeExperience = asyncHandler(async (req, res) => {
  console.log(req.body);
  const { _id } = req.body;

  if (!_id) {
    throw new ApiError(400, "Experience ID is required.");
  }

  // Ensure user exists
  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  // Check if the experience exists before attempting removal
  const experienceExists = user.experience.some(
    (exp) => exp._id.toString() === _id
  );
  if (!experienceExists) {
    throw new ApiError(404, "Experience not found.");
  }

  // Remove the experience
  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    {
      $pull: { experience: { _id } },
    },
    { new: true }
  ).select("-password -refreshToken -phoneNo -resume -avatar -address");

  // Sort the updated experience array: present jobs first, then by 'from' date descending
  updatedUser.experience.sort((a, b) => {
    if (a.present && !b.present) return -1;
    if (!a.present && b.present) return 1;
    return new Date(b.from) - new Date(a.from);
  });

  // Return the updated user data
  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedUser, "User experience removed successfully.")
    );
});

// getexpe no jwt
const getExperience = asyncHandler(async (req, res) => {
  const username = req.body.username;

  if (!username) {
    throw new ApiError(400, "No username is provided");
  }
  const user = await User.findOne({ username: username }).select(
    "-password -refreshToken -phoneNo -resume -avatar -address"
  );

  if (!user) {
    throw new ApiError(404, "user not found");
  }

  const userExperience = user.experience.sort((a, b) => a.to > b.to).reverse();

  return res
    .status(200)
    .json(new ApiResponse(200, userExperience, "current user skills fetched"));
});

// add certification
const addEducation = asyncHandler(async (req, res) => {
  const {
    _id, // If present, update the record
    institutionName,
    degree,
    from,
    to,
    description,
    grade,
  } = req.body;

  // Ensure user is logged in
  if (!req.user || !req.user._id) {
    throw new ApiError(401, "User is not logged in.");
  }

  // Validate required fields
  if (!institutionName || !degree || !from) {
    throw new ApiError(
      400,
      "Institution name, degree, and 'from' date are required."
    );
  }

  // Convert `from` and `to` into Date objects
  const fromDate = new Date(from);
  const toDate = to ? new Date(to) : null;

  // Validate date formats
  if (isNaN(fromDate.getTime())) {
    throw new ApiError(400, "'From' date is invalid.");
  }
  if (to && isNaN(toDate.getTime())) {
    throw new ApiError(400, "'To' date is invalid.");
  }
  if (toDate && toDate < fromDate) {
    throw new ApiError(
      400,
      "'To' date must be greater than or equal to 'From' date."
    );
  }

  // Fetch user
  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  // Check if updating an existing record
  if (_id) {
    const existingEducation = user.education.id(_id);

    if (!existingEducation) {
      throw new ApiError(404, "Education record not found.");
    }

    // Check for duplicates excluding the current record
    const duplicateExists = user.education.some(
      (edu) =>
        edu._id.toString() !== _id &&
        edu.institutionName === institutionName &&
        edu.degree === degree &&
        edu.from.getTime() === fromDate.getTime() &&
        ((!edu.to && !toDate) || edu.to?.getTime() === toDate?.getTime())
    );

    if (duplicateExists) {
      throw new ApiError(409, "An identical education record already exists.");
    }

    // Update the existing record
    existingEducation.institutionName = institutionName;
    existingEducation.degree = degree;
    existingEducation.from = fromDate;
    existingEducation.to = toDate;
    existingEducation.description =
      description || existingEducation.description;
    existingEducation.grade = grade || existingEducation.grade;
  } else {
    // Adding a new record
    const newEducation = {
      institutionName,
      degree,
      from: fromDate,
      to: toDate,
      description: description || "",
      grade: grade || "",
    };

    // Check for duplicates
    const duplicateExists = user.education.some(
      (edu) =>
        edu.institutionName === institutionName &&
        edu.degree === degree &&
        edu.from.getTime() === fromDate.getTime() &&
        ((!edu.to && !toDate) || edu.to?.getTime() === toDate?.getTime())
    );

    if (duplicateExists) {
      throw new ApiError(409, "An identical education record already exists.");
    }

    // Add new education record
    user.education.push(newEducation);
  }

  // Sort education records: current first, then by `to` date descending
  user.education.sort((a, b) => {
    if (!a.to && b.to) return -1; // Current education comes first
    if (a.to && !b.to) return 1;
    if (a.to && b.to) return new Date(b.to) - new Date(a.to);
    return 0;
  });

  // Save changes
  const updatedUser = await user.save();

  // Return updated education records
  return res.status(200).json({
    status: "success",
    message: _id
      ? "Education record updated successfully."
      : "Education added successfully.",
    education: updatedUser.education,
  });
});

const removeEducation = asyncHandler(async (req, res) => {
  const { _id } = req.body;

  if (!_id) {
    throw new ApiError(400, "Education ID is required to remove.");
  }

  // Check if the provided _id is a valid ObjectId
  if (!Mongoose.Types.ObjectId.isValid(_id)) {
    throw new ApiError(400, "Invalid Education ID format.");
  }

  // Ensure user is logged in
  if (!req.user || !req.user._id) {
    throw new ApiError(401, "User not authenticated.");
  }

  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  // Ensure the education entry exists before removing
  const educationExists = user.education.some(
    (edu) => edu._id.toString() === _id
  );

  if (!educationExists) {
    throw new ApiError(404, "Education entry not found.");
  }

  // Remove the education entry
  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    {
      $pull: { education: { _id: new Mongoose.Types.ObjectId(_id) } },
    },
    { new: true }
  ).select("-password -refreshToken -phoneNo -resume -avatar -address");

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedUser, "User education removed successfully")
    );
});

const getEducation = asyncHandler(async (req, res) => {
  const username = req.body.username;

  if (!username) {
    throw new ApiError(400, "No username provided");
  }

  const user = await User.findOne({ username: username }).select(
    "-password -refreshToken -phoneNo -resume -avatar -address"
  );

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Get the education array
  const userEducation = user.education;

  // Sort education by 'to' field (ascending), for those with no 'to', they will appear last
  userEducation.sort((a, b) => {
    if (a.to === null) return 1;
    if (b.to === null) return -1;
    return new Date(a.to) - new Date(b.to);
  });

  return res
    .status(200)
    .json(
      new ApiResponse(200, userEducation, "User education fetched successfully")
    );
});

export {
  Test,
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changePassword,
  getUser,
  getCurrentUser,
  updateUserOverview,
  updateAccountDetails,
  updateUserAvatar,
  updateUserBanner,
  searchJob,
  getskills,
  updateSkills,
  addExperience,
  getExperience,
  addEducation,
  getEducation,
  removeEducation,
  removeExperience,
};
