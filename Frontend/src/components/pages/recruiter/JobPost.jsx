import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useParams, useNavigate } from "react-router"; // Import useNavigate
import {
  alterJobPostActivation,
  deleteJobPost,
  getJobPostByJobId,
} from "../../../utils/jobPost.util";
import Company from "../../../assets/CompanyAvatar.png";
import {
  getJobApplication,
  submitApplication,
} from "../../../utils/user.utils";
import Button from "../../elements/form/Button";
import InputFile from "../../elements/form/InputFile";
function JobPost({ presentingTo = "user", preview = false }) {
  // Add preview as a prop
  const [loading, setLoading] = useState(true);
  const [jobData, setJobData] = useState(null); // Store the job data
  const [timeAgo, setTimeAgo] = useState("");
  const [isUploading, setIsUploading] = useState("");
  const [InfoUpdated, setInfoUpdated] = useState("");
  const [error, setError] = useState("");
  const [isApplicationOpen, setIsApplicationOpen] = useState(false);
  const [resume, setResume] = useState("");
  const [applied, setApplied] = useState(false);
  const { recruiterusername, jobid, username } = useParams(); // Get jobId from URL params

  const jobPost = useSelector((state) => state.jobPost) || {}; // Fallback to Redux jobPost data
  const recruiter = useSelector((state) => state.recruiter.recruiterData);

  const navigate = useNavigate();
  const displayText = (text) => {
    if (!text) return <span className="text-gray-400">dummy</span>;

    // Check if the input is an object and handle it accordingly
    if (typeof text === "object") {
      return <span className="text-gray-400">Object Data</span>; // Modify this to handle the object appropriately
    }
    return text;
  };

  // Function to fetch job post by jobId using the utility function
  const fetchJobPost = async (jobid) => {
    try {
      const response = await getJobPostByJobId(jobid);
      if (response) {
        const currentTime = new Date();
        const givenTime = new Date(response.createdAt);
        const diffInMs = currentTime - givenTime;

        // Calculate the difference in terms of time units
        const diffInSeconds = Math.floor(diffInMs / 1000);
        const diffInMinutes = Math.floor(diffInSeconds / 60);
        const diffInHours = Math.floor(diffInMinutes / 60);
        const diffInDays = Math.floor(diffInHours / 24);
        const diffInWeeks = Math.floor(diffInDays / 7);
        const diffInMonths = Math.floor(diffInDays / 30);
        const diffInYears = Math.floor(diffInDays / 365);

        // Format the time difference
        let formattedTimeAgo = "";

        if (diffInSeconds < 60) {
          formattedTimeAgo = `${diffInSeconds} second${
            diffInSeconds === 1 ? "" : "s"
          } ago`;
        } else if (diffInMinutes <= 60) {
          formattedTimeAgo = `${diffInMinutes} minute${
            diffInMinutes === 1 ? "" : "s"
          } ago`;
        } else if (diffInHours <= 24) {
          formattedTimeAgo = `${diffInHours} hour${
            diffInHours === 1 ? "" : "s"
          } ago`;
        } else if (diffInDays <= 7) {
          formattedTimeAgo = `${diffInDays} day${
            diffInDays === 1 ? "" : "s"
          } ago`;
        } else if (diffInWeeks <= 4) {
          formattedTimeAgo = `${diffInWeeks} week${
            diffInWeeks === 1 ? "" : "s"
          } ago`;
        } else if (diffInMonths < 12) {
          formattedTimeAgo = `${diffInMonths} month${
            diffInMonths === 1 ? "" : "s"
          } ago`;
        } else {
          formattedTimeAgo = `${diffInYears} year${
            diffInYears === 1 ? "" : "s"
          } ago`;
        }

        setTimeAgo(formattedTimeAgo);
        setJobData(response);
      } else {
        console.error("No job data found for the given jobId");
      }
    } catch (error) {
      console.error("Error fetching job post:", error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmitApplication = async (resume) => {
    if (!resume) {
      console.log("Please enter the resume first");
      setError("PLease make sure to select your resume before applying");
    }
    setIsUploading(true);
    const response = await submitApplication(resume, jobid);
    if (response?.error) {
      setError("already applied");
      setIsUploading(false);
      setApplied(true);
    } else {
      setIsUploading(false);
      setInfoUpdated(true);
      setIsApplicationOpen(false);
      setApplied(true);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      if (jobid) {
        // If jobId is in params, fetch the job data from the server using the utility function
        await fetchJobPost(jobid);
      } else if (jobPost && jobPost.jobPostName) {
        // Fallback to Redux jobPost data if available
        setJobData(jobPost);
      } else {
      }
    };
    const getApplication = async () => {
      if (!username) {
        console.log("username is not available");
      }
      if (!jobid) {
        console.log("jobid didnt found");
      }
      const response = await getJobApplication(jobid);
      console.log(response);

      if (response?.error) {
        console.log("failed function");
      } else if (response.application == []) {
        console.log("user havent applied yet for this job role");
        setApplied(false);
      } else if (response.application._id) {
        setApplied(true);
      }
    };
    fetchData();
    getApplication();
    setLoading(false);
  }, [jobid, jobPost, setError]);

  // Event handlers for the buttons
  const handleApply = () => {
    setIsApplicationOpen(true);
    // Redirect to application page or open an application form
  };

  const handleEdit = () => {
    alert("Redirecting to the edit page...");
    // Navigate to the edit job page
    navigate(`/recruiter/${recruiterusername}/post-a-job/${jobid}`);
  };

  const handleDeactivate = async () => {
    const response = await alterJobPostActivation(jobData._id);
    if (!response) {
      alert("problem occurd in handleDeactivate function");
    } else {
      console.log(response);
      setJobData((prev) => ({
        ...prev,
        isActive: response.isActive, // Correct way to update `isActive` from response
      }));
    }
    // Add logic to deactivate the job post via an API call
  };

  const handleDelete = async () => {
    const response = await deleteJobPost(jobData._id);

    alert("your job post is successfully deleted ");
    window.history.back();
  };
  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (!jobData) {
    return <div className="text-center">No job data found.</div>;
  }

  // Determine which data to use based on the `preview` prop
  const companyName = preview
    ? recruiter.rCompanyName
    : jobData.jobPostCompany.rCompanyName;
  const avatar = preview
    ? recruiter.avatar
    : jobData.jobPostCompany.avatar || Company;

  console.log(jobData);

  return (
    <div className="h-max min-h-screen w-full bg-sectionBackground flex items-start justify-center py-4 px-1">
      <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200 max-w-screen-lg w-full">
        <div className="flex flex-col justify-between gap-3">
          <div className="flex items-center mb-2">
            <img
              src={avatar ? avatar : Company}
              alt="Company Logo"
              className=" rounded mr-4 w-10 aspect-square"
            />
            <div className="text-center">
              <h2 className="text-2xl font-bold text-primary text-center capitalize">
                {displayText(companyName)}{" "}
                {/* Ensure this works for both strings and objects */}
              </h2>
            </div>
          </div>
          <div
            className={`text-[4vw] xs:text-sm sm:text-[1rem] flex rounded-full px-2 items-center justify-center w-max border-2 border-dashed py-0 gap-1 h-max ${
              recruiter.rVerificationStatus === "verified"
                ? "border-green-500 text-green-500"
                : recruiter.rVerificationStatus === "rejected"
                ? "border-red-500 text-red-500"
                : "border-yellow-500 text-yellow-500"
            }`}
          >
            <i className="fa-regular fa-circle-check"></i>
            {recruiter.rVerificationStatus === "verified"
              ? "Verified Recruiter"
              : recruiter.rVerificationStatus === "rejected"
              ? "Unverified Recruiter"
              : "Pending Verification"}
          </div>
        </div>

        {/* Job Post Name in a separate full-width div */}
        <div className="w-full bg-white pt-4 flex flex-col gap-2 border-b border-gray-300 py-2">
          <h1 className="text-2xl font-bold  text-accent">
            {displayText(jobData.jobPostName)}
          </h1>
          <p className="text-sm text-gray-500 flex gap-2">
            <i className="fa-solid fa-location-dot text-gray-500 text-sm"></i>{" "}
            {displayText(jobData.jobPostAddress)}
            <i className="fa-solid fa-history text-gray-500 text-sm"></i>{" "}
            {displayText(timeAgo)}
          </p>
          <div className="flex gap-1 flex-wrap">
            <div className="flex items-center bg-lightgreen bg-green-100 rounded px-2 w-max gap-1">
              <i className="fa-solid fa-building text-green-700"></i>
              <span className="text-green-700 font-semibold capitalize">
                {jobData.jobPostMode}
              </span>
            </div>
            <div className="flex items-center bg-lightgreen bg-green-100 rounded px-2 w-max gap-1">
              <i className="fa-solid fa-clock text-green-700"></i>
              <span className="text-green-700 font-semibold capitalize">
                {jobData.jobPostType}
              </span>
            </div>
            <div className="flex items-center bg-lightgreen bg-green-100 rounded px-2 w-max gap-1">
              <i className="fa-solid fa-layer-group text-green-700"></i>
              <span className="text-green-700 font-semibold capitalize">
                {jobData.jobPostLevel}
              </span>
            </div>
            <div className="flex items-center bg-lightgreen bg-green-100 rounded px-2 w-max gap-1">
              <i className="fa-solid fa-suitcase text-green-700"></i>
              <span className="text-green-700 font-semibold capitalize">
                {jobData.jobPostQualification}
              </span>
            </div>
            {jobData.jobPostMinSalary > 0 || jobData.jobPostMaxSalary > 0 ? (
              <div className="flex items-center bg-lightgreen bg-green-100 rounded px-2 w-max gap-1">
                <i className="fa-solid fa-indian-rupee-sign text-green-700"></i>
                <span className="text-green-700 font-semibold capitalize">
                  {`${jobData.jobPostMinSalary}~${jobData.jobPostMaxSalary}`}
                </span>
              </div>
            ) : null}
            <div className="flex items-center bg-lightgreen bg-green-100 rounded px-2 w-max gap-1">
              <i className="fa-solid fa-user-tie text-green-700"></i>
              <span className="text-green-700 font-semibold capitalize">
                {jobData.jobPostVacancies}
              </span>
            </div>
          </div>
        </div>
        <div className="w-full bg-white pt-4 flex flex-col gap-2 border-b border-gray-300 py-2">
          {jobData.jobPostSkill.length > 0 &&
          !(jobData.jobPostSkill.length === 1 && jobData.jobPostSkill[0] === "")
            ? jobData.jobPostSkill.map((elem, index) => (
                <div
                  className="max-w-full break-all text-[4vw] xs:text-sm sm:text-[1rem] flex rounded-full px-4 py-1 items-center justify-center w-max  capitalize   gap-1 bg-green-200 text-green-800"
                  key={index}
                >
                  {elem}
                </div>
              ))
            : "No skills added by recruiter"}
        </div>
        {/* Job Description below the details */}
        <div className="mt-4">
          <h3 className="text-lg font-semibold prose">Job Description</h3>
          {jobData.jobPostDescription ? (
            <div
              dangerouslySetInnerHTML={{ __html: jobData.jobPostDescription }}
              className="prose"
            />
          ) : (
            <p className="text-gray-400">dummy description text</p>
          )}
        </div>

        {/* Action Buttons - Conditionally Rendered */}
        <div className="mt-6 flex justify-between gap-4">
          {jobData.isActive == true && presentingTo === "user" && (
            <button
              onClick={handleApply}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
            >
              {applied ? "Applied" : "Apply Job"}
            </button>
          )}
          {!preview &&
            presentingTo === "recruiter" &&
            recruiter.rUserName === recruiterusername && (
              <>
                <Link
                  to={`/recruiter/${recruiterusername}/jobs/${jobid}/job-applications`}
                  className="px-4 py-2 bg-blue-200 flex gap-2 items-center justify-center  text-blue-700 rounded-lg hover:bg-blue-300 hover:text-blue-800  transition duration-200 font-semibold"
                >
                  <i className="fa-solid fa-eye"></i>
                  View Applications
                </Link>
                <button
                  onClick={handleEdit}
                  className="px-4 py-2 bg-green-200 text-green-700 font-semibold rounded-lg hover:bg-green-300 flex gap-2 items-center transition duration-200"
                >
                  <i className="fa-solid fa-square-pen "></i>
                  Edit
                </button>
                <button
                  onClick={handleDeactivate}
                  className={`${
                    jobData.isActive
                      ? "bg-red-300 text-red-800   hover:bg-red-300"
                      : "bg-green-300 text-green-800 hover:bg-green-300"
                  } px-4 py-2   rounded-lg transition duration-200 w-max font-semibold flex gap-2 items-center`}
                >
                  <i
                    className={`fa-solid ${
                      jobData.isActive ? "fa-lock" : "fa-unlock"
                    }`}
                  ></i>
                  {jobData.isActive ? "Deactivate Post" : "Activate Post"}
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-200 text-red-700 font-semibold flex items-center justify-between gap-2 hover:bg-red-300 rounded-lg transition duration-200"
                >
                  <i className="fa-solid fa-trash-can"></i>
                  Delete
                </button>
              </>
            )}
          {presentingTo == "admin" && (
            <Link
              to={`/admin/recruiter/${recruiterusername}/${jobid}/view-applications`}
              className="px-4 py-2 bg-blue-200 flex gap-2 items-center justify-center  text-blue-700 rounded-lg hover:bg-blue-300 hover:text-blue-800  transition duration-200 font-semibold"
            >
              <i className="fa-solid fa-eye"></i>
              View Applications
            </Link>
          )}
        </div>
      </div>

      <div
        className={`${
          isApplicationOpen ? "flex" : "hidden"
        } z-20 font-primary  text-white  fixed  left-[50%] top-[50%] translate-y-[-50%] p-4 translate-x-[-50%]  min-h-24 w-full max-w-screen-md `}
      >
        <div className="px-4 w-full min-h-24 rounded-lg bg-darkBackground [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 ">
          <div className=" w-full flex items-center justify-between border-b-[1px] border-b-white py-6 px-2 ">
            <h1 className="text-xl text-white  font-[500] ">Apply for job</h1>
            <div
              className="w-8 h-8 aspect-square hover:bg-sectionBackground text-white hover:text-darkSection flex items-center justify-center rounded-full "
              onClick={() => {
                setIsApplicationOpen(false);
              }}
            >
              <i className="fa-solid fa-close text-2xl "></i>
            </div>
          </div>
          <div
            className={`mt-6 mb-2 rounded w-full text-red-500 border-2 px-2 py-1 border-red-500 ${
              error ? "block" : "hidden"
            }`}
          >
            {error}
          </div>
          {applied ? (
            <h1 className="p-6 text-center text-wrap">
              User already have applied for job
            </h1>
          ) : (
            <form className="py-4 flex flex-col gap-2">
              <InputFile
                key={"Resume"}
                label="Upload Resume:"
                accept=".pdf,.doc,.docx"
                note="Accepted file formats: .pdf, .doc, .docx"
                onChange={(e) => {
                  setError("");
                  console.log(error);
                  setResume(e.target.files[0]);
                }}
                required
              />
              <Button
                type="button"
                onClick={async () => {
                  setInfoUpdated(false);
                  const response = await onSubmitApplication(resume);
                  if (response) {
                    setInfoUpdated(true);
                  }
                }}
                className={`ml-auto w-max py-2 px-5 me-2 mb-2 flex text-[5vw] xs:text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-sectionBackground dark:hover:text-white dark:hover:bg-gray-700 text-wrap `}
              >
                {isUploading ? (
                  <>
                    <svg
                      className="mr-3 h-5 w-5 animate-spin text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <span className="font-medium"> Processing... </span>
                  </>
                ) : (
                  "Send Application"
                )}
              </Button>
              {InfoUpdated ? (
                <p className="text-green-500">
                  Your Resume Uploaded Successfully
                </p>
              ) : (
                ""
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default JobPost;
