import axios from "axios";

async function createRecruiterAccount(
  credentials = {
    rEmail: "",
    rCompanyName: "",
    rPassword: "",
    rConfirmPassword: "",
  }
) {
  try {
    // Check if all fields are filled
    if (
      !credentials.rEmail ||
      !credentials.rCompanyName ||
      !credentials.rPassword ||
      !credentials.rConfirmPassword
    ) {
      console.log("Please fill all the fields");
      return { error: "Please fill all the fields" };
    }

    // Check if the password length is at least 8 characters
    if (credentials.rPassword.length < 8) {
      console.log("Password length should be more than 7 characters");
      return { error: "Password length should be more than 7 characters" };
    }

    // Check if the passwords match
    if (credentials.rPassword !== credentials.rConfirmPassword) {
      console.log("Both passwords should be the same");
      return { error: "Both passwords should be the same" };
    }

    // Proceed with registration
    const response = await axios.post(
      "/api/v1/recruiter/register",
      credentials
    );

    // If registration was successful, login the recruiter
    if (response.data) {
      const login = await createRecruiterSession({
        rEmail: credentials.rEmail,
        rPassword: credentials.rPassword,
      });
      return login;
    } else {
      console.log("Error in registering the recruiter");
      return { error: "Error in registering the recruiter" };
    }
  } catch (error) {
    // Improved error handling
    if (error.response) {
      if (error.response.status === 409) {
        return { error: "A recruiter with the same email already exists" };
      } else if (error.response.status === 500) {
        return { error: "Internal server error during registration" };
      } else {
        return { error: "An error occurred during registration" };
      }
    } else {
      console.error("Network error or no response from server", error);
      return { error: "Network error or no response from server" };
    }
  } finally {
    console.log("createRecruiterAccount function complete");
  }
}

async function createRecruiterSession(
  credentials = {
    rEmail: "",
    rPassword: "",
  }
) {
  try {
    console.log(credentials);
    if (credentials.rEmail != "" && credentials.rPassword != "") {
      if (credentials.rPassword.length >= 8) {
        const response = await axios.post(
          "/api/v1/recruiter/create-session",
          credentials
        );
        return response.data.data;
      } else {
        return { error: "password should consist 8 or more than character" };
      }
    } else {
      return { error: "please fill up all fields" };
    }
  } catch (error) {
    console.log(error);
    return { error: "Invalid Credentials" };
  } finally {
    console.log("createRecruiterSession done");
  }
}
async function getCurrentRecruiter() {
  try {
    const response = await axios.post(
      "/api/v1/recruiter/get-current-recruiter"
    );
    return response.data.data; // Ensure this path is correct
  } catch (error) {
    console.log(error);
    return { error: "recruiter not found" };
  } finally {
    console.log("getCurrentRecruiter function complete");
  }
}
async function terminateRecruiterSession() {
  try {
    console.log("terminateRecruiterSession starts");
    const response = await axios.post("/api/v1/recruiter/terminate-session");
    console.log(response);
  } catch (error) {
    console.log("terminateRecruiterSession error from recruiter.utils:", error);
  } finally {
    console.log("terminate Recruiter Session function complete");
  }
}
async function getRecruiterProfile(rUserName) {
  try {
    if (rUserName) {
      const response = await axios.post(
        "/api/v1/recruiter/get-recruiter-profile",
        { rUserName }
      );
      if (response != null) {
        return response.data.data;
      } else {
        console.log("Response returned null");
        return { error: "Response returned null" };
      }
    } else {
      console.log("rUserName is empty");
      return { error: "rUserName is empty" };
    }
  } catch (error) {
    console.log("getRecruiterProfile provided erro while requesting", error);
    return { error: "getRecruiterProfile provided erro while requesting" };
  } finally {
    console.log("function of get Recruiter Profile is complete");
  }
}
async function avatarUploadRecruiter(file) {
  try {
    console.log(file);
    const formData = new FormData();
    formData.append("avatar", file);
    const response = await axios.post(
      "/api/v1/recruiter/upload-avatar",
      formData,
      {
        headers: {
          // 'Content-Type': 'multipart/form-data',
        },
      }
    );
    if (response) {
      return await getCurrentRecruiter();
    } else {
      console.log("error occured while uploading the image");
      return { error: "error occured while uploading the image" };
    }
  } catch (error) {
    console.log("avatarUploadRecruiter function returned error", error);
    return { error: "avatarUploadRecruiter function returned error" };
  } finally {
    console.log("avatarUploadRecruiter function ran successfully");
  }
}
async function bannerUploadRecruiter(file) {
  try {
    console.log(file);
    const formData = new FormData();
    formData.append("banner", file);
    const response = await axios.post(
      "/api/v1/recruiter/upload-banner",
      formData,
      {
        headers: {
          // 'Content-Type': 'multipart/form-data',
        },
      }
    );
    console.log("sdrsrwr");
    if (response) {
      return await getCurrentRecruiter();
    } else {
      console.log("error occured while uploading the image");
      return { error: "error occured while uploading the image" };
    }
  } catch (error) {
    console.log("bannerUploadRecruiter function returned error", error);
    return { error: "bannerUploadRecruiter function returned error" };
  } finally {
    console.log("bannerUploadRecruiter function ran successfully");
  }
}

async function editProfileIntroduction(recruiterIntro) {
  try {
    console.log(recruiterIntro);
    if (
      recruiterIntro.rCompanyName !== "" &&
      recruiterIntro.rHeadline !== "" &&
      recruiterIntro.rLocation !== "" &&
      recruiterIntro.rWebsite !== "" &&
      recruiterIntro.rIndustry !== "" &&
      recruiterIntro.rPhoneNo !== "" &&
      recruiterIntro.rFoundingYear !== 0 && // Check if it is not zero
      recruiterIntro.rEmployeeCount !== 0 // Check if it is not zero
    ) {
      if (
        recruiterIntro.rPhoneNo.length >= 7 &&
        recruiterIntro.rPhoneNo.length <= 15
      ) {
        const response = await axios.post(
          "/api/v1/recruiter/edit-profile-intro",
          recruiterIntro
        );
        console.log(response);
        if (response.data != null) {
          return response.data.recruiter;
        } else {
          console.log(
            "editprofileintroduction function axios request returned errror"
          );
          return { error: "internal server error please try again later" };
        }
      } else {
        console.log(
          "Phone Number Length Should be more than 7 digits and less than or equal to 15"
        );
        return {
          error:
            "Phone Number Length Should be more than 7 digits and less than or equal to 15",
        };
      }
    } else {
      console.log("One or more fields are empty or zero:", recruiterIntro);
      return { error: "One or more fields are empty or zero" };
    }
  } catch (error) {
    console.log(" editProfileIntroduction function returned error", error);
    return { error: " editProfileIntroduction function returned error" };
  } finally {
    console.log("editProfileIntroduction function ran successfully");
  }
}

async function updateRecruiterOverview(_id, companyOverview) {
  try {
    // Check if the input parameters are valid
    console.log(companyOverview);
    if (!_id || !companyOverview) {
      return { error: "Recruiter ID and company overview are required." };
    }

    // Set up the API URL
    const url = "/api/v1/recruiter/update-company-overview";

    // Prepare the request body
    const requestBody = {
      _id: _id,
      companyOverview: companyOverview,
    };

    // Make the API call using axios
    const response = await axios.post(url, requestBody);

    // Check if the response was successful
    if (response.status >= 200 && response.status < 300) {
      // Handle success
      console.log(response.data);
      return response.data; // Return data if needed elsewhere
    } else {
      // Handle error if status code is not 2xx
      return { error: "Function could not update given data" };
    }
  } catch (error) {
    console.error("Error:", error);
    return { error: "Could not update overview (catch block)" };
  }
}

export {
  createRecruiterAccount,
  createRecruiterSession,
  getCurrentRecruiter,
  terminateRecruiterSession,
  avatarUploadRecruiter,
  bannerUploadRecruiter,
  editProfileIntroduction,
  getRecruiterProfile,
  updateRecruiterOverview,
};
