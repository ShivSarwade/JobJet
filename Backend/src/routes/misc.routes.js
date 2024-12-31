import { Router } from "express";
import {
    Test,
    requestfeature,
    getAllFeatures,
    reportBug,
    reportFraud,
    feedbackAndRate,
    changePassword,
    searchJob
} from '../controllers/misc.controller.js'

const router=Router()

router.route('/Testing').get(Test)
router.route('/requestAFeature').post(requestfeature)
router.route('/get-features-list').get(getAllFeatures)
router.route('/report-bug').post(reportBug)
router.route('/report-A-Fraud').post(reportFraud)
router.route('/feedback-And-Rate').post(feedbackAndRate)
router.route("/change-password").post(changePassword)
router.route("/search-jobs").post(searchJob)


export default router