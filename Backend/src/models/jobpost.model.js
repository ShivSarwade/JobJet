import mongoose, { Schema } from "mongoose";

const jobPostSchema = new Schema(
  {
    // **Job Details**
    jobPostName: {
      type: String,
      required: true
    },
    jobPostDescription: {
      type: String,
      required: true,
    },
    jobPostAddress: {
      type: String,
      required: true
    },
    jobPostSkill: {
      type: [String], // Array of skills
      required: true,
      default: [],
      trim: true // Trims each skill string
    },

    // **Company Information**
    jobPostCompany: {
      type: mongoose.Schema.ObjectId,
      ref: "Recruiter", // Refers to a "Recruiter" collection
      required: true,
    },

    // **Job Type & Compensation**
    jobPostType: {
      type: String,
      enum: ["fulltime", "parttime", "internship", "contract"], // Enum for job types (lowercase)
      default: "fulltime", // Default job type is "fulltime"
      required: true
    },
    jobPostMinSalary: {
      type: Number,
      required: true,
      set: function(value) {
        if (value < 0) {
          console.log('Invalid minimum salary, setting to 0.');
          return 0; // Set to 0 if less than 0
        }
        return value; // Return the value if valid
      }
    },
    jobPostMaxSalary: {
      type: Number,
      required: true,
      set: function(value) {
        if (value < 0) {
          console.log('Invalid maximum salary, setting to 0.');
          return 0; // Set to 0 if less than 0
        }
        return value; // Return the value if valid
      }
    },

    // **Job Mode & Level**
    jobPostMode: {
      type: String,
      enum: ['hybrid', 'onsite', 'remote'], // Job mode options (lowercase)
      default: 'onsite', // Default job mode is "onsite"
    },
    jobPostLevel: {
      type: String,
      enum: ['entry-level', 'mid-level', 'senior', 'lead', 'manager'], // Job level options (lowercase)
      default: 'entry-level', // Default job level is "entry-level"
    },

    // **Qualifications**
    jobPostQualification: {
      type: String,
      enum: ['bachelor\'s', 'master\'s', 'none'], // Qualification options (lowercase)
      default: 'none', // Default qualification is "none"
    },

    // **Vacancies** - Defaults to 1 if not provided and ensures it's never less than 1
    jobPostVacancies: {
      type: Number, // Number of job vacancies available
      required: false, // Not required
      default: 1, // Default value is 1
      set: function(value) {
        if (value < 1) {
          console.log('Invalid vacancies count, setting to 1.');
          return 1; // Set to 1 if less than 1
        }
        return value; // Return the value if valid
      }
    },
    isActive:{
      type:Boolean,
      default:true,
      required:true
    }
  },
  { timestamps: true }
);

export const JobPost = mongoose.model("JobPost", jobPostSchema);
