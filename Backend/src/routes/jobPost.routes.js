import { Router } from "express";
import { getJobPostByRecruiterUsername, getJobPostDetailsById } from "../controllers/jobPost.controller.js";

const router = Router();

// Define a GET route to fetch job posts by recruiter username
// :rUserName is the URL parameter, and count is passed as a query parameter
router.route("/get-jobs-posts-by-recruiter-username/:rUserName").get(getJobPostByRecruiterUsername);
router.route("/get-jobs-posts-by-job-id/:jobId").get(getJobPostDetailsById);

export default router;
