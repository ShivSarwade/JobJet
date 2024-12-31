import { Router } from "express";
import {
  Test,
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  updateAccountDetails,
  updateUserAvatar,
  updateUserOverview,
  getskills,
  updateSkills,
  getUser,
  getCurrentUser,
  updateUserBanner,
  addExperience,
  getExperience,
  addEducation,
  getEducation,
  removeExperience,
  removeEducation,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/userAuth.middleware.js";
import { applyJob, getApplication, getAppliedJobsByUserID } from "../controllers/jobPost.controller.js";

const router = Router();

router.route("/Usertesting").post(Test);

router
  .route("/register")
  .post(upload.fields([{ name: "avatar", maxCount: 1 }]), registerUser);

router.route("/create-session").post(loginUser);

//secured routes
router.route("/terminate-session").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router
  .route("/upload-avatar")
  .post(verifyJWT, upload.single("avatar"), updateUserAvatar);
router
  .route("/upload-banner")
  .post(verifyJWT, upload.single("banner"), updateUserBanner);
router.route("/get-user").post(getUser);
router.route("/get-current-user").get(verifyJWT, getCurrentUser);
router.route("/update-user-profile").post(verifyJWT,upload.single("resume"), updateAccountDetails);
router.route("/update-user-overview").post(verifyJWT, updateUserOverview);
router.route("/get-user-skills").get(verifyJWT, getskills);
router.route("/update-user-skills").post(verifyJWT, updateSkills);
router.route("/add-user-experince").post(verifyJWT,addExperience)
router.route("/remove-user-experience").post(verifyJWT,removeExperience)
router.route("/get-user-experince").get(getExperience)
router.route("/add-user-education").post(verifyJWT,addEducation)
router.route("/remove-user-education").post(verifyJWT,removeEducation)
router.route("/get-user-education").get(getEducation)
router.route("/apply-job").post(verifyJWT,upload.single("resume"),applyJob)
router.route("/get-job-application").post(verifyJWT,getApplication)
router.route("/get-applied-jobs-by-userid").get(verifyJWT,getAppliedJobsByUserID)


export default router;
