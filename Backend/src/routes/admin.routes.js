import { Router } from "express";
import { createAdmin, 
    getRecruiterCount, 
    getUserCount, 
    getStats,
    loginAdmin, 
    logoutAdmin, 
    Test,
    updateAdminDetails,
    uploadAdminAvatar,
    verifyJobPost,
    getCurrentUser,
    getRecruiterInfo,
    getAllJobApplicationsForAdmin,
    verifyRecruiter
 } from "../controllers/admin.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/adminAuth.middleware.js";

const router=Router()

router.route("/test").post(Test)
router.route("/sigin").post(createAdmin)
router.route("/login").post(loginAdmin)

//secured routes
router.route("/get-current-admin").get(verifyJWT,getCurrentUser)
router.route("/update-admin").post(verifyJWT,updateAdminDetails)
router.route("/upload-avatar").post(verifyJWT,upload.single("avatar"),uploadAdminAvatar)
router.route("/logout").post(verifyJWT,logoutAdmin)
router.route("/verify-job-post").post(verifyJWT,verifyJobPost)
router.route("/get-recruiter-count").get(verifyJWT,getRecruiterCount)
router.route("/get-user-count").get(verifyJWT,getUserCount)
router.route("/get-stats").get(verifyJWT,getStats)
router.route("/get-all-recruiters").get(verifyJWT,getRecruiterInfo)
router.route("/get-all-jobposts").get(verifyJWT,getAllJobApplicationsForAdmin)
router.route("/verify-recruiter").post(verifyJWT,verifyRecruiter)
router.route("/get-job-applications").post(verifyJWT,getAllJobApplicationsForAdmin)

export default router