import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  recruiterData: {
    recruiterId: null, // Unique identifier for the recruiter
    firstName: null,
    lastName: null,
    fullName: null,
    email: "recruiter@gmail.com",
    phone: null,
    company: null,
    jobTitle: null,
    location: null, // Can include city, state, etc.
    industry: null, // E.g., Technology, Healthcare, etc.
    experienceYears: null, // Number of years of recruiting experience
    skills: [], // Array of skills relevant to recruiting
    candidatesPlaced: [], // Array of candidate IDs or objects
    jobListings: [], // Array of job listing IDs or objects
    isActive: true, // Status indicating if the recruiter is currently active
    isRecruiterVerified: false,
    isBasicInfoComplete: false,
    rOverview: "Overview not uploaded",
  },
  isRecruiterLoggedIn: false,
};

export const RecruiterSlice = createSlice({
  name: "recruiter",
  initialState: initialState,
  reducers: {
    logInRecruiter: (state, action) => {
      state.isRecruiterLoggedIn = true;
      state.recruiterData = action.payload;
    },
    logOutRecruiter: (state) => {
      state.isRecruiterLoggedIn = false;
      state.recruiterData = initialState.recruiterData;
    },
    updateRecruiterData: (state, action) => {
      state.recruiterData.rCompanyName = action.payload.rCompanyName;
      state.recruiterData.rHeadline = action.payload.rHeadline;
      state.recruiterData.rLocation = action.payload.rLocation;
      state.recruiterData.rWebsite = action.payload.rWebsite;
    },
    updateCompanyOverview: (state, action) => {
      state.recruiterData.rOverview = action.payload;
    },
  },
});

export const {
  logInRecruiter,
  logOutRecruiter,
  updateRecruiterData,
  updateCompanyOverview,
} = RecruiterSlice.actions;

export default RecruiterSlice.reducer;
