import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";

function RecruiterAuthContainer({ className, children }) {
  const recruiter = useSelector((state) => state.recruiter);
  const [isStateLoaded, setIsStateLoaded] = useState(false); // Track if state is fully loaded
  const navigate = useNavigate();

  useEffect(() => {
    // Ensure all required state values are initialized before navigation
    setIsStateLoaded(
      typeof recruiter.isRecruiterLoggedIn !== "undefined" &&
      recruiter.recruiterData && // Ensure recruiterData exists
      typeof recruiter.recruiterData.rBasicProfileComplete !== "undefined" &&
      typeof recruiter.recruiterData.rUserName !== "undefined"
    );
  }, [recruiter]);

  useEffect(() => {
    if (isStateLoaded) {
      if (recruiter.isRecruiterLoggedIn) {
        if (recruiter.recruiterData.rBasicProfileComplete) {
          // Allow access to the protected route
          console.log("Recruiter logged in and profile complete");
        } else {
          console.log("Redirecting to recruiter profile setup");
          navigate(`/recruiter/${recruiter.recruiterData.rUserName}`);
        }
      } else {
        console.log("Recruiter not logged in, redirecting to login");
        navigate("/recruiter/login");
      }
    }
  }, [isStateLoaded, recruiter.isRecruiterLoggedIn, recruiter.recruiterData, navigate]);

  // Render a loader or placeholder until state is fully loaded
  if (!isStateLoaded) {
    return <div>Loading...</div>; // Replace with a spinner or loader component if needed
  }

  return <Outlet />;
}

export default RecruiterAuthContainer;
