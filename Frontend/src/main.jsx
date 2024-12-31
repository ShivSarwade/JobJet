import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

// Redux Toolkit
import store from "./app/store.js";
import { Provider } from "react-redux";

// React Router
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

// Pages import
import {
  Home,
  UserLayout,
  Jobs,
  AboutUs,
  Sitemap,
  Careers,
  TermsAndConditions,
  PrivacyPolicy,
  FAQ,
  ReportAFraud,
  RequestAFeature,
  FeedbackAndRate,
  UserForgetPassword,
  JobApplication,
  ReportABug,
  UserAuthContainer,
  UserProfile,
  UserLogin,
  UserSignIn,
  RecruiterLayout,
  RecruiterProfile,
  RecruiterLogin,
  RecruiterSignIn,
  AdminLayout,
  AdminDashboard,
  AdminLogIn,
  AdminSignIn,
  RecruiterAuthContainer,
  AdminAuthContainer,
  RecruiterAllJobs,
  JobPost,
} from "./components/";
import PostAJob from "./components/pages/recruiter/PostAJob.jsx";

// Define the Router
const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* STATIC Routes */}
      <Route path="/" element={<UserLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="jobs" element={<Jobs presentingTo="user"/>} />

        <Route
          path="jobs/:recruiterusername/:jobid"
          element={<JobPost presentingTo="user" />}
        />
        <Route path="about" element={<AboutUs />} />
        <Route path="sitemap" element={<Sitemap />} />
        <Route path="privacy-policy" element={<PrivacyPolicy />} />
        <Route path="faq" element={<FAQ />} />
        <Route path="terms-and-conditions" element={<TermsAndConditions />} />
        <Route
          path="feedback-and-rate"
          element={<FeedbackAndRate servedTo="user" />}
        />
        <Route
          path="report-a-fraud"
          element={<ReportAFraud servedTo="user" />}
        />
        <Route
          path="request-a-feature"
          element={<RequestAFeature servedTo="user" />}
        />
        <Route path="report-a-bug" element={<ReportABug servedTo="user" />} />
        <Route path="login" element={<UserLogin />} />
        <Route path="register" element={<UserSignIn />} />
        <Route path="/reset-password" element={<UserForgetPassword />} />

        {/* USER ROUTES */}
        <Route path="" element={<UserAuthContainer />}>
          <Route
            path=":username"
            element={<UserProfile presentingTo="user" />}
          />


          <Route path=":username/jobs" element={<Jobs presentingTo="user"/>} />
          <Route
            path=":username/recruiter/:recruiterusername"
            element={<RecruiterProfile presentingTo="user" />}
          />
          <Route
            path=":username/jobs/:recruiterusername/:jobid"
            element={<JobPost presentingTo="user" />}
          />
          <Route
            path=":username/jobs/:recruiterusername/all-jobs"
            element={<RecruiterAllJobs RecruiterAllJobs="user" />}
          />


        </Route>
      </Route>

      {/* Recruiter Routes */}
      <Route path="recruiter" element={<RecruiterLayout />}>
        <Route
          path="report-a-fraud"
          element={<ReportAFraud servedTo="recruiter" />}
        />
        <Route
          path="request-a-feature"
          element={<RequestAFeature servedTo="recruiter" />}
        />
        <Route
          path="report-a-bug"
          element={<ReportABug servedTo="recruiter" />}
        />
        <Route path="login" element={<RecruiterLogin />} />
        <Route path="register" element={<RecruiterSignIn />} />
        <Route path="reset-password" element={<UserForgetPassword />} />



        {/* stage 1 Protected Routes */}
        <Route path="" element={<RecruiterAuthContainer />}>
          {/* Recruiter Profile and Jobs */}

          <Route path=":recruiterusername" element={<RecruiterProfile presentingTo="recruiter"/>} />
          <Route path=":recruiterusername/search-jobs" element={<Jobs presentingTo="recruiter"/>} />
          <Route path=":recruiterusername/post-a-job" element={<PostAJob />} />
          
          <Route
            path=":recruiterusername/post-a-job/:jobid"
            element={<PostAJob />}
          />
          <Route
            path=":recruiterusername/jobs/:jobid/job-applications"
            element={<JobApplication />}
          />

          <Route
            path=":recruiterusername/all-jobs"
            element={<RecruiterAllJobs presentingTo="recruiter" />}
          />
          <Route
            path=":recruiterusername/jobs/:jobid"
            element={<JobPost presentingTo="recruiter" />}
          />
          <Route
            path=":recruiterusername/post-a-job/preview"
            element={<JobPost presentingTo="recruiter" preview={true}/>}
          />
          <Route
            path=":recruiterusername/post-a-job/:jobid/preview"
            element={<JobPost />}
          />

          <Route
            path=":recruiterusername/user/:username"
            element={<UserProfile presentingTo="user" />}
          />
        </Route>
      </Route>

      {/* Admin Routes */}
      <Route path="admin" element={<AdminLayout />}>
        <Route path="login" element={<AdminLogIn />} />

        <Route path="" element={<AdminAuthContainer />}>
          <Route index element={<AdminDashboard />} />
          <Route
            path="recruiter/:recruiterusername"
            element={<RecruiterProfile presentingTo="admin" />}
          />
          <Route
            path="recruiter/:recruiterusername/all-jobs"
            element={<RecruiterAllJobs presentingTo="admin" />}
          />
          <Route
            path="recruiter/:recruiterusername/:jobid"
            element={<JobPost presentingTo="admin" />}
          />
          <Route
            path="recruiter/:recruiterusername/:jobid/view-applications"
            element={<JobApplication presentingTo="admin"/>}
          />
           <Route
            path="user/:username"
            element={<UserProfile presentingTo="admin" />}
          />
          <Route path="register" element={<AdminSignIn />} />
        </Route>
        <Route
          path="feedback-and-rate"
          element={<FeedbackAndRate servedTo="admin" />}
        />
        <Route
          path="report-a-fraud"
          element={<ReportAFraud servedTo="admin" />}
        />
        <Route
          path="request-a-feature"
          element={<RequestAFeature servedTo="admin" />}
        />
        <Route path="report-a-bug" element={<ReportABug servedTo="admin" />} />
      </Route>
    </>
  )
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
);
