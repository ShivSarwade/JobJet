import axios from "axios";

async function createUserAccount(
  credentials = {
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
  }
) {
  try {
    if (
      credentials.email != "" &&
      credentials.firstName != "" &&
      credentials.lastName != "" &&
      credentials.password != "" &&
      credentials.confirmPassword != ""
    ) {
      if (credentials.password.length >= 8) {
        if (credentials.password === credentials.confirmPassword) {
          const response = await axios.post(
            "/api/v1/user/register",
            credentials
          );

          if (response.data != null) {
            const login = await createUserSession({
              email: credentials.email,
              password: credentials.password,
            });
            return login;
          } else {
            return { error: "user not logged in " };
          }
        } else {
          return { error: "password doesnt match with confirm password" };
        }
      } else {
        return { error: "password length should be of 8 or more character" };
      }
    } else {
      return { error: "enter data in all fields" };
    }
  } catch (error) {
    if (error.response.status === 409) {
      return { error: "User with email already exists." };
    } else if (error.response.status === 500) {
      return { error: "Error in registering user:" };
    } else {
      return { error: "createUserAccount error misc from user.utils.js" };
    }
  } finally {
    console.log("CreateUserAccount function  complete");
  }
}
async function createUserSession(credentials = { email: "", password: "" }) {
  try {
    if (credentials.email != "" && credentials.password != "") {
      if (credentials.password.length >= 8) {
        const response = await axios.post(
          "/api/v1/user/create-session",
          credentials
        );
        return response.data.data;
      } else {
        return { error: "password should consist 8 or more character" };
      }
    } else {
      return { error: "No field should be null" };
    }
  } catch (error) {
    return { error: "invalid credentials" };
  } finally {
    console.log("createusersession function  complete");
  }
}
async function getCurrentUser() {
  try {
    const response = await axios.get("/api/v1/user/get-current-user");
    return response.data.data; // Return the user data directly
  } catch (error) {
    // console.log("getcurrentuser error from user.utils:", error);
    return { error: "user not found" };
  } finally {
    console.log("getcurrentuser function complete");
  }
}
async function terminateUserSession() {
  try {
    console.log("terminateusersession starts");
    const response = await axios.post("/api/v1/user/terminate-session");
    console.log(response);
    return response.data.data;
  } catch {
    console.log("terminateUserSession error from user.utils :", error);
    return { error: "no user found" };
  } finally {
    console.log("terminateusersession function complete");
  }
}
async function getUser(username = "") {
  try {
    console.log(username);

    if (!username) {
      return { error: "username not found" };
    }
    const response = await axios.post("/api/v1/user/get-user", { username });
    console.log(response);
    return response.data.data;
  } catch (error) {
    return { error: "getuser function returns error" };
  } finally {
    console.log("getUser function complete");
  }
}
async function avatarUploadUser(file) {
  try {
    console.log(file);
    const formData = new FormData();
    formData.append("avatar", file);
    const response = await axios.post("/api/v1/user/upload-avatar", formData, {
      headers: {
        // 'Content-Type': 'multipart/form-data',
      },
    });
    if (response) {
      return await getCurrentUser();
    } else {
      console.log("error occured while uploading the image");
      return { error: "error occured while uploading the image" };
    }
  } catch (error) {
    console.log("avatarUploadUser function returned error", error);
    return { error: "avatarUploadUser function returned error" };
  } finally {
    console.log("avatarUploadUser function ran successfully");
  }
}
async function bannerUploadUser(file) {
  try {
    const formData = new FormData();
    formData.append("banner", file);
    const response = await axios.post("/api/v1/user/upload-banner", formData, {
      headers: {
        // 'Content-Type': 'multipart/form-data',
      },
    });
    if (response) {
      return await getCurrentUser();
    } else {
      console.log("error occured while uploading the image");
      return { error: "error occured while uploading the image" };
    }
  } catch (error) {
    console.log("bannerUploadUser function returned error", error);
    return { error: "bannerUploadUser function returned error" };
  } finally {
    console.log("bannerUploadUser function ran successfully");
  }
}
async function updateAboutUserData(about) {
  try {
    // Check if the input parameters are valid
    console.log(about);
    if (!about) {
      return { error: "Recruiter ID and company overview are required." };
    }
    // Set up the API URL
    const url = "/api/v1/user/update-user-overview";
    // Prepare the request body
    const requestBody = {
      about: about,
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
  } finally {
    console.log("updateAboutUserData fn complete");
  }
}
async function updateSkill(skills) {
  const url = "/api/v1/user/update-user-skills";
  try {
    const response = await axios.post(url, { newSkills: skills });
    if (!response) {
      return { error: "updateSkills Could not update the skills" };
    }
    console.log(response);
    return response.data.data;
  } catch (error) {
    console.error("Error:", error);
    return { error: "Could not update skills (catch block)" };
  } finally {
    console.log("updateAboutUserData fn complete");
  }
}
async function updateExperience(experience) {
  try {
    // Validate input
    if (
      !experience ||
      !experience.companyName ||
      !experience.role ||
      !experience.from
    ) {
      return {
        error:
          "Company name, role, and from date are required to update experience.",
      };
    }

    // If 'present' is true, 'to' is not required; otherwise, validate 'to'
    if (
      !experience.present &&
      (!experience.to || new Date(experience.to) < new Date(experience.from))
    ) {
      return {
        error:
          "'to' date must be provided and later than 'from' date when 'present' is false.",
      };
    }

    // Set up the API URL
    const url = " /api/v1/user/add-user-experince";

    // Prepare the request body
    const requestBody = {
      _id: experience._id ? experience._id : "",
      companyName: experience.companyName,
      role: experience.role,
      from: experience.from,
      to: experience.present ? null : experience.to, // Set 'to' as null if 'present' is true
      description: experience.description || "",
      present: !!experience.present, // Ensure 'present' is a boolean
    };

    // Make the API call using axios
    const response = await axios.post(url, requestBody);

    // Handle successful response
    if (response.status >= 200 && response.status < 300) {
      console.log("Experience updated successfully:", response.data);
      return response.data.experience; // Return data if needed elsewhere
    } else if (response.status == 409) {
      return { error: "experience already exist" };
    } else {
      // Handle non-2xx status code
      return { error: "Failed to update experience. Please try again later." };
    }
  } catch (error) {
    // Handle any errors during the API call
    console.error("Error updating experience:", error);
    return {
      error: "An error occurred while updating the experience (catch block).",
    };
  } finally {
    console.log("updateExperienceData function complete.");
  }
}
async function deleteExperience(experienceId) {
  try {
    // Check if the experienceId is provided
    if (!experienceId) {
      return { error: "Experience ID is required." };
    }

    // Set up the API endpoint
    const url = "/api/v1/user/remove-user-experience";

    // Make the API call using axios
    const response = await axios.post(url, { _id: experienceId });

    // Check if the response was successful
    if (response.status >= 200 && response.status < 300) {
      console.log("Experience deleted successfully:", response.data);
      return response.data; // Return response data for further use
    } else {
      console.error("Error: Unable to delete experience");
      return { error: "Unable to delete experience." };
    }
  } catch (error) {
    // Handle errors
    console.error("Error during deleteExperience:", error);
    return { error: error.response?.data?.message || "An error occurred." };
  } finally {
    console.log("deleteExperience function completed.");
  }
}
async function updateEducation(education) {
  try {
    // Validate input
    if (
      !education ||
      !education.institutionName ||
      !education.degree ||
      !education.from
    ) {
      return {
        error:
          "Institution name, degree, and from date are required to update education.",
      };
    }

    // If 'to' is provided, validate that it is later than 'from' unless 'present' is true
    if (
      !education.present &&
      (!education.to || new Date(education.to) < new Date(education.from))
    ) {
      return {
        error:
          "'to' date must be provided and later than 'from' date when 'present' is false.",
      };
    }

    // Set up the API URL for updating education
    const url = "/api/v1/user/add-user-education";

    // Prepare the request body
    const requestBody = {
      _id: education._id ? education._id : "", // If _id exists, include it for updating
      institutionName: education.institutionName,
      degree: education.degree,
      from: education.from,
      to: education.present ? null : education.to, // Set 'to' as null if 'present' is true
      description: education.description || "",
      grade: education.grade || "",
      present: !!education.present, // Ensure 'present' is a boolean
    };

    // Make the API call using axios
    const response = await axios.post(url, requestBody);

    // Handle successful response
    if (response.status >= 200 && response.status < 300) {
      console.log("Education updated successfully:", response.data);
      return response.data.education; // Return the updated education array if needed elsewhere
    } else if (response.status === 409) {
      return { error: "Education already exists" };
    } else {
      // Handle non-2xx status code
      return { error: "Failed to update education. Please try again later." };
    }
  } catch (error) {
    // Handle any errors during the API call
    console.error("Error updating education:", error);
    return {
      error: "An error occurred while updating the education (catch block).",
    };
  } finally {
    console.log("updateEducation function complete.");
  }
}
async function deleteEducation(educationId) {
  try {
    // Check if the educationId is provided
    if (!educationId) {
      return { error: "Education ID is required." };
    }

    // Set up the API URL for deleting education
    const url = "/api/v1/user/remove-user-education";

    // Make the API call using axios
    const response = await axios.post(url, { _id: educationId });

    // Check if the response was successful
    if (response.status >= 200 && response.status < 300) {
      console.log("Education deleted successfully:", response.data);
      return response.data; // Return the response data if needed elsewhere
    } else {
      console.error("Error: Unable to delete education");
      return { error: "Unable to delete education." };
    }
  } catch (error) {
    // Handle errors
    console.error("Error during deleteEducation:", error);
    return { error: error.response?.data?.message || "An error occurred." };
  } finally {
    console.log("deleteEducation function completed.");
  }
}
async function updateProfile(userData) {
  try {
    const formData = new FormData();

    // Dynamically append non-empty fields
    for (let key in userData) {
      if (
        userData[key] !== undefined &&
        userData[key] !== null &&
        userData[key] !== ""
      ) {
        formData.append(key, userData[key]);
      }
    }

    // Send the API request
    const response = await axios.post(
      "/api/v1/user/update-user-profile",
      formData
    );
    console.log(response);

    return response.data.data; // Handle response
  } catch (error) {
    console.error("Error updating profile:", error);
    return { error: error.response?.data?.message || "Something went wrong." };
  }
}
async function submitApplication(resume, jobId) {
  try {
    const formData = new FormData();
    if (!jobId) {
      return { error: "pass jobId first" };
    }
    if (!resume) {
      return { error: "reusme not found" };
    }
    formData.append("resume", resume);
    formData.append("jobId", jobId);
    console.log(formData);

    const response = await axios.post("/api/v1/user/apply-job", formData);
    if (response) {
      console.log(response);
    }
  } catch (error) {
    console.log(error);

    return { error: error.message };
  }
}
async function getJobApplication(jobId) {
  try {
    if (!jobId) {
      return { error: "no username found " };
    } else {
      const response = await axios.post("/api/v1/user/get-job-application", {
        jobId,
      });
      if (response.error) {
        return { error: response.data };
      } else {
        return response.data;
      }
    }
  } catch (error) {
    return { error: "No job found" };
  }
}
async function resetPassword(
  userInfo = {
    Email: "",
    oldPassword: "",
    Password: "",
    // ConfirmPassword: ""
  }
) {
  try {
    const response = await axios.post(
      "http://localhost:7000/api/v1/misc/change-password",
      userInfo
    );
    console.log(response);

    if (response) {
      return response;
    }
  } catch (error) {
    if (error.response) {
      if (error.response.status === 500) {
        return { error: "Internal server error while changing password" };
      } else {
        return { error: "An error occurred while changing password" };
      }
    } else {
      console.error("Network error or no response from server", error);
      return { error: "Network error or no response from server" };
    }
  }
}
async function searchJob(title, location, count = 10, page = 1) {
  try {
    if (!count || count < 1) {
      return {
        error: "Pass the count in integer to retrive jobs from search jobs",
      };
    }
    if (!page || page < 1) {
      return {
        error:
          "Pass the Page number in integer to retrive jobs from search jobs",
      };
    }
    const response = await axios.post(
      `/api/v1/misc/search-jobs/?count=${count}&page=${page}`,
      { title: title, location: location }
    );
    if (!response) {
      console.log("searchJobs response not found");
      return { error: "searchJobs response not found" };
    }
    console.log(response)
    return response.data.data;

  } catch (error) {
    console.log("error occurred in searchJobs", error);
    return { error: "error occurred in searchJobs" };
  } finally {
    console.log("searchJobs ran successfully");
  }
}

export {
  createUserAccount,
  getUser,
  getCurrentUser,
  createUserSession,
  terminateUserSession,
  avatarUploadUser,
  bannerUploadUser,
  updateAboutUserData,
  updateSkill,
  updateExperience,
  deleteExperience,
  updateEducation,
  deleteEducation,
  updateProfile,
  submitApplication,
  getJobApplication,
  resetPassword,
  searchJob
};
