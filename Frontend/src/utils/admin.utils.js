import axios from "axios";

async function getAdminData() {
  try {
    const response = await axios.get("/api/v1/admin/get-current-admin");
    return response.data.data;
  } catch (error) {
    return { error: "admin not found" };
  } finally {
    console.log("getcurrentadmin fuunction completed");
  }
}

async function createAdminAccount(
  credentials = {
    firstName: "",
    lastName: "",
    adminEmail: "",
    adminPassword: "",
    confirmPassword: "",
  }
) {
  try {
    if (
      credentials.adminEmail != "" &&
      credentials.firstName != "" &&
      credentials.lastName != "" &&
      credentials.adminPassword != "" &&
      credentials.confirmPassword != ""
    ) {
      if (credentials.adminPassword.length >= 8) {
        if (credentials.adminPassword === credentials.confirmPassword) {
          const response = await axios.post("/api/v1/admin/sigin", credentials);

          if (response.data != null) {
            const login = await createAdminSession({
              email: credentials.adminEmail,
              password: credentials.adminPassword,
            });
            return login;
          } else {
            return { error: "admin not logged in " };
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
      return { error: "admin with email already exists." };
    } else if (error.response.status === 500) {
      return { error: "Error in registering admin:" };
    } else {
      return { error: "createAdminAccount error misc from admin.utils.js" };
    }
  } finally {
    console.log("CreateAdminAccount function  complete");
  }
}

async function createAdminSession(
  credentials = {
    email: "",
    password: "",
  }
) {
  try {
    if (credentials.email != "" && credentials.password != "") {
      console.log(credentials);

      if (credentials.password.length >= 8) {
        const response = await axios.post("/api/v1/admin/login", credentials);
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
    console.log("createAdminsession function  complete");
  }
}
async function clearAdminSession() {
  try {
    console.log("terminateAdminsession starts");
    const response = await axios.post("/api/v1/admin/logout");
    console.log(response.data);
    return response.data.data;
  } catch (error) {
    console.log("terminateAdminSession error from admin.utils :");
    // { error:};
    return { error: "no user found" };
  } finally {
    console.log("terminateAdminsession function complete");
  }
}
async function getStats() {
  try {
    const response = await axios.get("/api/v1/admin/get-stats");
    console.log(response.data.data)
    return response.data.data;
  } catch (error) {
    return { error: "error getting stats" };
  } finally {
    console.log("get stats function completed");
  }
}
async function getRecruiterInfo() {
  try {
    const response = await axios.get("/api/v1/admin/get-all-recruiters");
    console.log(response.data.data)
    // console.log( response.data);
    return response.data.data;
  } catch (error) {
    return { error: "error getting recruiter info" };
  } finally {
    console.log("getRecruiterInfo function completed");
  }
}
async function recruiterVerification(
  verification = {
    recruiterId: "",
    verificationStatus: "verified",
  }
) {
  try {
    const response = await axios.post("/api/v1/admin/verify-recruiter",verification);
    console.log(response.status);
    return response.status;
  } catch (error) {
    return { error: "error verifying recruiter " };
  } finally {
    console.log("recruiterVerification function completed");
  }
}

export {
  getAdminData,
  createAdminAccount,
  createAdminSession,
  clearAdminSession,
  getStats,
  getRecruiterInfo,
  recruiterVerification,
};
