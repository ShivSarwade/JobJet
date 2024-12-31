import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Outlet, useNavigate, useParams } from "react-router-dom";

function AdminAuthContainer() {
  const { recruiterusername, username } = useParams();

  // Extract the necessary states
  const isAdminLoggedIn = useSelector((state) => state.admin.isAdminLoggedIn);
  const isUserLoggedIn = useSelector((state) => state.user.isUserLoggedIn);
  const isRecruiterLoggedIn = useSelector((state) => state.recruiter.isRecruiterLoggedIn);

  const [isStateLoaded, setIsStateLoaded] = useState(false); // Track if state is loaded
  const navigate = useNavigate(); 

  useEffect(() => {
    // Simulate state loading (if necessary, you can remove this if state is always synchronously available)
    setIsStateLoaded(
      typeof isAdminLoggedIn !== "undefined" &&
      typeof isUserLoggedIn !== "undefined" &&
      typeof isRecruiterLoggedIn !== "undefined"
    );
  }, [isAdminLoggedIn, isUserLoggedIn, isRecruiterLoggedIn]);

  useEffect(() => {
    if (isStateLoaded) {
      if (isRecruiterLoggedIn && !isAdminLoggedIn) {
        console.log("Admin not logged in, redirecting to recruiter dashboard");
        navigate(`/recruiter/${recruiterusername}`);
      } else if (isUserLoggedIn && !isAdminLoggedIn) {
        console.log("Admin not logged in, redirecting to user dashboard");
        navigate(`/${username}`);
      } else if (!isUserLoggedIn && !isAdminLoggedIn) {
        console.log("Admin is not logged in, redirecting to admin login");
        navigate("/admin/login");
      }
    }
  }, [isStateLoaded, isAdminLoggedIn, isUserLoggedIn, isRecruiterLoggedIn, navigate, recruiterusername, username]);

  // Show a loading state until the state is fully loaded
  if (!isStateLoaded) {
    return <div>Loading...</div>; // You can replace this with a proper loader component
  }

  return <Outlet />;
}

export default AdminAuthContainer;
