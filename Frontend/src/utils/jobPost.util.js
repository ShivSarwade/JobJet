import axios from "axios";

async function getJobPostByRecruiterUsername(
  recruiterUserName = "",
  count = 10,
  page = 1
) {
  try {
    if (!recruiterUserName) {
      console.log("recruiterUsername not found");
      return { error: "recruiterUsername not found" };
    }
    if (count && count < 1) {
      console.log("count not found");
      count = 10;
    }
    if (page && page < 1) {
      console.log("page not found");
      page = 1;
    }

    const response = await axios.get(
      `/api/v1/jobs/get-jobs-posts-by-recruiter-username/${recruiterUserName}?count=${count}&page=${page}`
    );

    if (!response) {
      console.log("getJobPostByRecruiterUserName response not found");
      return { error: "getJobPostByRecruiterUserName response not found" };
    }
    return response.data.data;
  } catch (error) {
    console.log("error occurred in getJobPostByRecruiterUsername", error);
    return { error: "error occurred in getJobPostByRecruiterUsername" };
  } finally {
    console.log("getJobPostByRecruiterUsername ran successfully");
  }
}

async function getJobPostByJobId(jobid = "") {
  try {
    console.log(jobid)
    if (!jobid) {
      console.log("jobid  not found");
      return { error: "jobid not found" };
    }
    const response = await axios.get(
      `/api/v1/jobs/get-jobs-posts-by-job-id/${jobid}`
    );
    if (!response) {
      console.log("getJobPostByJobId response not found");
      return { error: "getJobPostByJobId response not found" };
    }
    return response.data.data
    
  } catch {
    console.log("error occurred in getJobPostByJobId", error);
    return { error: "error occurred in getJobPostByJobId" };
  } finally {
    console.log("getJobPostByJobId ran successfully");
  }
}

async function createOrUpdateJobPost(
  JobPostData = {
    _id: null, // Optional ID for updating an existing job post
    jobPostName: "",
    jobPostDescription: "",
    jobPostAddress: "",
    jobPostSkill: [],
    jobPostType: "fulltime",
    jobPostMinSalary: 0,
    jobPostMaxSalary: 0,
    jobPostMode: "onsite",
    jobPostLevel: "entry-level",
    jobPostQualification: "none",
    jobPostVacancies: 1,
  }
) {
  try {
    const {
      _id,
      jobPostName,
      jobPostDescription,
      jobPostAddress,
      jobPostSkill,
      jobPostType,
      jobPostMinSalary,
      jobPostMaxSalary,
      jobPostMode,
      jobPostLevel,
      jobPostQualification,
      jobPostVacancies,
    } = JobPostData;

    // Prepare the object for API request
    const payload = {};

    // Conditionally add properties to the payload
    if (jobPostName) payload.jobPostName = jobPostName;
    if (jobPostDescription) payload.jobPostDescription = jobPostDescription;
    if (jobPostAddress) payload.jobPostAddress = jobPostAddress;
    if (jobPostSkill.length > 0) payload.jobPostSkill = jobPostSkill;

    if (
      ["fulltime", "parttime", "internship", "contract"].includes(jobPostType)
    ) {
      payload.jobPostType = jobPostType;
    }

    // Ensure salary fields are set, using 0 if negative
    payload.jobPostMinSalary = jobPostMinSalary >= 0 ? jobPostMinSalary : 0;
    payload.jobPostMaxSalary = jobPostMaxSalary >= 0 ? jobPostMaxSalary : 0;

    if (["hybrid", "onsite", "remote"].includes(jobPostMode)) {
      payload.jobPostMode = jobPostMode;
    }

    if (
      ["entry-level", "mid-level", "senior", "lead", "manager"].includes(
        jobPostLevel
      )
    ) {
      payload.jobPostLevel = jobPostLevel;
    }

    if (["bachelor's", "master's", "none"].includes(jobPostQualification)) {
      payload.jobPostQualification = jobPostQualification;
    }

    // Ensure jobPostVacancies is valid, using 1 as a fallback
    payload.jobPostVacancies = jobPostVacancies >= 1 ? jobPostVacancies : 1;

    // If there's an _id (for update), add it to the payload
    if (_id !== null) {
      payload._id = _id;
    }

    console.log("Payload being sent:", payload);

    // Make API request to create or update the job post
    const response = await axios.post(
      "/api/v1/recruiter/create-or-update-job-post",
      payload
    );

    // Handle the response
    if (response && response.data) {
      console.log("Job post created/updated successfully:", response.data);
      return response.data.jobPost;
    } else {
      console.log("No response data from createOrUpdateJobPost");
      return { error: "No response data from createOrUpdateJobPost" };
    }
  } catch (error) {
    console.log("Error occurred in createOrUpdateJobPost", error);
    return { error: "Error occurred in createOrUpdateJobPost" };
  } finally {
    console.log("createOrUpdateJobPost function completed");
  }
}

async function alterJobPostActivation(_id) {
  try {
    // Check if _id is valid
    if (!_id) {
      return { error: "_id not Found" };
    }

    // Await the axios request to ensure the function waits for the response
    const response = await axios.post("/api/v1/recruiter/alter-job-post-activation", { _id });

    // Check if response is successful and contains data
    if (!response || !response.data) {
      console.log("alterJobPostActivation response not found");
      return { error: "alterJobPostActivation response not found" };
    }

    // Log the data and return it
    console.log(response.data.jobPost);
    return response.data.jobPost;

  } catch (error) {
    // Capture the error and log it properly
    console.log("Error occurred in alterJobPostActivation", error);
    return { error: "Error occurred in alterJobPostActivation" };
  } finally {
    console.log("The alterJobPostActivation function is complete");
  }
}

async function deleteJobPost(_id) {
  try {
    // Check if _id is valid
    if (!_id) {
      return { error: "_id not Found" };
    }

    // Await the axios request to ensure the function waits for the response
    const response = await axios.post("/api/v1/recruiter/delete-job-post", { _id });
    console.log(response);
    
    // Check if response is successful and contains data
    if (!response || !response.data) {
      console.log("deleteJobPost response not found");
      return { error: "deleteJobPost response not found" };
    }

    // Log the result and return it
    console.log("Job post deleted:", response.data.jobPost);
    return response.data.jobPost;

  } catch (error) {
    // Capture the error and log it properly
    console.log("Error occurred in deleteJobPost", error);
    return { error: "Error occurred in deleteJobPost" };
  } finally {
    console.log("The deleteJobPost function is complete");
  }
}


async function getJobApplications( jobId, recruiterusername, presentedTo="admin" ) {
  try {
    // Make the API call to fetch job applications
    const url = presentedTo!="recruiter"?"/api/v1/admin/get-job-applications": "/api/v1/recruiter/get-job-applications"
    const response = await axios.post(url, {
      jobId,
      recruiterusername,
    });

    // Check if the response is successful
    if (response.status === 200 && response.data.success) {
      return  response.data.data // The job applications
    } else {
      // Handle unexpected API response
      return {
        success: false,
        message: response.data.message || "Failed to fetch job applications.",
      };
    }
  } catch (error) {
    // Handle network or server errors
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "An error occurred while fetching job applications.",
    };
  } finally {
    // Any cleanup logic (if needed)
    console.log("Job applications fetch attempt completed.");
  }
}


export { getJobPostByRecruiterUsername, createOrUpdateJobPost, getJobPostByJobId,alterJobPostActivation,deleteJobPost, getJobApplications};
