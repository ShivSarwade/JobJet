import axios from "axios";

function trimValues(obj) {
    if (typeof obj !== 'object' || obj === null) {
        return obj; // Return if not an object or if null
    }

    const trimmedObject = Array.isArray(obj) ? [] : {};

    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            if (typeof obj[key] === 'string') {
                trimmedObject[key] = obj[key].trim(); // Trim string values
            } else if (typeof obj[key] === 'object') {
                trimmedObject[key] = trimValues(obj[key]); // Recursively trim nested objects
            } else {
                trimmedObject[key] = obj[key]; // Keep other types unchanged
            }
        }
    }

    return trimmedObject;
}

async function requestAFeature(
    feature={
        email:'',
        featureName:'',
        featureDescription:''
    }
) {
    try{
        const response=await axios.post('http://localhost:7000/api/v1/misc/requestAFeature/',feature)
        if(response.data)
        {
            return response
        }
    }
    catch(error)
    {
        if (error.response) {
            if (error.response.status === 500) {
                return { error: "Internal server error during registration" };
            } else {
                return { error: "An error occurred during posting feature" };
            }
        } else {
            console.error("Network error or no response from server", error);
            return { error: "Network error or no response from server" };
        }
    }
}

async function reportABug(
    bug={
        email: "",
        bugCategory: "",
        bugTitle: "",
        bugDescription: ""
    }
) {
    try{
        const response=await axios.post('http://localhost:7000/api/v1/misc/report-bug/',bug)
        if(response.data)
            {
                return response
            }
    }
    catch(error){
        if (error.response) {
            if (error.response.status === 500) {
              return { error: "Internal server error during sending bug report" };
            } else {
              return { error: "An error occurred during posting bug report" };
            }
          } else {
            console.error("Network error or no response from server", error);
            return { error: "Network error or no response from server" };
          }
    }
}
async function reportAFraud(
    fraud={ email:"",
        jobTitle: "",
        companyName: "",
        fraudDetails:""}
) {
    try {
        const response= await axios.post('http://localhost:7000/api/v1/misc/report-A-Fraud',fraud)
        if(response)
        {
            return response
        }
    } catch (error) {
        if (error.response) {
            if (error.response.status === 500) {
              return { error: "Internal server error during sending fraud report" };
            } else {
              return { error: "An error occurred during posting fraud report" };
            }
          } else {
            console.error("Network error or no response from server", error);
            return { error: "Network error or no response from server" };
          }
    }
}
async function feedbackAndRate(
    feedback = {
        email: "",
        rating: null,
        feedback: ""
    }
) {
    try {
        const response= await axios.post('http://localhost:7000/api/v1/misc/feedback-And-Rate',feedback)
        if(response)
        {
            return response
        }
    } catch (error) {
        if (error.response) {
            if (error.response.status === 500) {
                return { error: "Internal server error during sending feedback" };
            } else {
                return { error: "An error occurred during posting feedback" };
            }
        } else {
            console.error("Network error or no response from server", error);
            return { error: "Network error or no response from server" };
        }
    }
}
export {
    trimValues,
    requestAFeature,
    reportABug,
    reportAFraud,
    feedbackAndRate
}