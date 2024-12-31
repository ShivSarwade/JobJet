import { configureStore } from '@reduxjs/toolkit'
import UserSlice from './Reducers/user.slice.js'
import RecruiterSlice from './Reducers/recruiter.slice.js'
import AdminSlice from './Reducers/admin.slice.js'
import StaticPagesSlice from './Reducers/staticPages.slice.js'
import jobPostSlice from './Reducers/jobpost.slice.js'
const store = configureStore({
  reducer: {
    user: UserSlice,
    recruiter: RecruiterSlice,
    admin: AdminSlice,
    staticPages: StaticPagesSlice,
    jobPost:jobPostSlice
  },
}
);

export default store