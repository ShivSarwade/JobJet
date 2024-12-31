import { Router } from "express";
import {
  Test,
  registerRecruiter,
  loginRecruiter,
  logoutRecruiter,
  refreshAccessToken,
  changePassword,
  getCurrentRecruiter,
  getRecruiterProfile,
  updateRecruiterPersonalDetails,
  uploadBanner,
  uploadAvatar,
  editProfileIntro,
  createOrUpdateJobPost,
  alterJobPostActivation,
  deleteJobPost,
  updateRecruiterOverview,
  getAllJobApplicationsForRecruiter
} from "../controllers/recruiter.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/recruiterAuth.middleware.js";

const router = Router();

router.route("/test").post(Test);
router.route("/register").post(registerRecruiter); //http://localhost:7000/api/v1/recruiter/rsignin
router.route("/create-session").post(loginRecruiter);

//secured routes
router.route("/terminate-session").post(verifyJWT, logoutRecruiter);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/change-password").post(changePassword);
router.route("/get-current-recruiter").post(verifyJWT, getCurrentRecruiter); 
router.route("/get-recruiter-profile").post(getRecruiterProfile); 
router.route("/update-personal-details").post(verifyJWT,updateRecruiterPersonalDetails);
router.route("/update-company-overview").post(verifyJWT,updateRecruiterOverview);
router.route("/upload-banner").post(verifyJWT,upload.single("banner"),uploadBanner)
router.route("/upload-avatar").post(verifyJWT,upload.single("avatar"),uploadAvatar)
router.route("/edit-profile-intro").post(verifyJWT,editProfileIntro)


// create job post
router.route("/create-or-update-job-post").post(verifyJWT,createOrUpdateJobPost)
router.route("/alter-job-post-activation").post(verifyJWT,alterJobPostActivation)
router.route("/delete-job-post").post(verifyJWT,deleteJobPost)
router.route("/get-job-applications").post(verifyJWT,getAllJobApplicationsForRecruiter)


export default router;
  