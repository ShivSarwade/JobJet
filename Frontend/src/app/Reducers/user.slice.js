import { createSlice } from "@reduxjs/toolkit";

const initialValue = {
    userData: {
        firstName: null,
        lastName: null,
        fullName: null,
        username: null,
        address: null,
        city: null,
        state: null,
        country: null,
        postalCode: null,
        email: "user@gmail.com",
        currentJobTitle: null,
        currentCompany: null,
        currentSalary: null,
        resumeUrl: null,
        avatarUrl: null,
        bannerUrl: null,
        phone: null,
        bio: null,
        skills: [], // Consider adding id for each skill
        education: [], // Consider adding id for each education record
        certifications: [], // Consider adding id for each certification
        experience: [
            {
                id: null, // Unique identifier for the experience
                jobTitle: null,
                company: null,
                startDate: null,
                endDate: null, // Can also use "Present"
                description: null,
                location: null,
                jobType: null // Consider enum values: "Remote", "Hybrid", "Onsite"
            }
        ],
        isUserActive: true,
        isSeekingJob: false,
        about:"about not provided"
    },
    isUserLoggedIn: false
};

export const UserSlice = createSlice({
    name: "user",
    initialState: initialValue,
    reducers: {
        logInUser:(state,action)=>{
            state.isUserLoggedIn = true;
            state.userData = action.payload     
            console.log("state changed to true")
        },
        logOutUser:(state)=>{
            state.isUserLoggedIn = false;
            state.userData = initialValue.userData 
            console.log("state changed to false")
        },
        updateAbout:(state,action)=>{
            state.userData.about = action.payload
        }
        
    }

});
export const {
    logInUser,
    logOutUser,

    updateAbout
} = UserSlice.actions

export default UserSlice.reducer;
