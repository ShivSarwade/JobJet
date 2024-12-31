import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const educationSchema = new mongoose.Schema({
  institutionName: {
    type: String,
    required: true, // Name of the institution
  },
  degree: {
    type: String,
    required: true, // Degree (e.g., Bachelors, Masters, etc.)
  },
  from: {
    type: Date,
    required: true, // Start date of the education
  },
  to: {
    type: Date,
    required: true, // End date of the education
  },
  description: {
    type: String,
    // Optional: Description or additional details about the education
  },
  grade: {
    type: String,
    // Optional: Grade or GPA achieved
  },
});

const experienceSchema = new mongoose.Schema({
  companyName: { type: String, required: true }, // Name of the company
  role: { type: String, required: true }, // Role or job title
  from: { type: Date, required: true }, // Start year
  to: { type: Date }, // End year
  description: { type: String, required: true }, // Job description or responsibilities
  present: { type: Boolean, default: false },
});
const userSchema = new Schema(
  {
    username: {
      type: String,
      // required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    age:{type:Number},
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    education: [educationSchema],
    address: {
      type: String,
      // required:true,
      lowercase: true,
      trim: true,
    }, //?
    phoneNo: {
      type: Number,
      // required:true,
    },
    headline: {
      type: String,
      default: "JobJet User did not updated his headline",
      maxlength: 150,
    },
    location: {
      type: String,
      default: "",
    },
    resume: {
      type: String, //cloudinary url
    }, //user will upload his resume

    about: {
      type: String,
      default: "User Overview not Available",
    },
    avatar: {
      type: String, //cloudinary url
      // required:true
    }, //user will upload his profile photo here
    banner: {
      type: String,
    },

    password: {
      type: String,
      required: [true, "Password is required"],
    },
    skills: {
      type: [String],
    },

    experience: [experienceSchema],
    refreshToken: {
      type: String,
    },
    basicProfileComplete: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 7);
    next();
  } else {
    next();
  }
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      firstName: this.firstName,
      lastName: this.lastName,
      location: this.location,
      phoneNo: this.phoneNo,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};
userSchema.methods.generateRefreshToken = function () {
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

export const User = mongoose.model("User", userSchema);
