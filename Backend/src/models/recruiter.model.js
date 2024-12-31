import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const recruiterSchema = new Schema(
  {
    rUserName: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    rEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
    },
    rPhoneNo: {
      type: Number,
    },
    rCompanyName: {
      type: String,
      required: true,
      trim: true,
    },
    rHeadline: {
      type: String,
      trim: true,
    },
    rLocation: {
      type: String,
      trim: true,
    },
    rWebsite: {
      type: String,
      validate: {
        validator: function (v) {
          return /^(http|https):\/\/[^ "]+$/.test(v); // Simple URL validation
        },
        message: (props) => `${props.value} is not a valid URL!`,
      },
    },
    rIndustry: {
      type: String,
      trim: true,
    },
    
    rFoundingYear: {
      type: Number,
      min: 1600,
      max: new Date().getFullYear(),
    },
    rEmployeeCount: {
      type: Number,
      min: 1,
    },
    rVerificationStatus: {
      type: String,
      default: false,
    },
    rBasicProfileComplete: {
      type: Boolean,
      default: false, // Default to false
    },
    rOverview:{
      type: String,
      default:"Company Overview not Available"
    },
    rPassword: {
      type: String,
      required: [true, "Password is required"],
    },
    refreshToken: {
      type: String,
    },
    avatar: {
      type: String,
      default:null
    },
    banner: {
      type: String,
      default:null
    },
  },
  { timestamps: true }
);
recruiterSchema.pre("save", async function (next) {
  if (this.isModified("rPassword")) {
    this.rPassword = await bcrypt.hash(this.rPassword, 7);
    next();
  } else {
    next();
  }
});

recruiterSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.rPassword);
};

recruiterSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      rUsername: this.rUsername,
      rEmail: this.Remail,
      rPhoneNo: this.rPhoneNo,
      rCompanyName: this.rCompanyName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};
recruiterSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};
export const Recruiter = mongoose.model("Recruiter", recruiterSchema);
