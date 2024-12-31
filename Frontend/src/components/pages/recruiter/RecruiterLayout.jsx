import React, { useState, useEffect } from "react";
import { Header, Footer, Loader } from "../../index";
import { Outlet } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentRecruiter } from "../../../utils/recruiter.utils";
import { logInRecruiter } from "../../../app/Reducers/recruiter.slice";

function RecruiterLayout() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const [error,setError] = useState()
  let RecruiterData = useSelector((state) => state.recruiter);
  console.log("recryuter layour call;ed");
  
  useEffect(() => {
    const fetchRecruiterData = async () => {
      setLoading(true);
      setError(null); // Reset error state before fetching
      try {
        const response = await getCurrentRecruiter();
        if (response.error) {
          console.log(response)
          setError(response.error); // Set error if response has an error
        } else {

          dispatch(logInRecruiter(response)); // Await dispatch to ensure it resolves
          console.log("hello")
          // navigate(`/recruiter/${response.rUserName}/`)
        }
      } catch (error) {
        console.log("Recruiter not logged in:", error);
        setError("An error occurred while fetching data."); // Optional: set a user-friendly error message
      } finally {
        setLoading(false); // Always reset loading state
      }
    };
  
    // Fetch recruiter data only if not logged in
    if (!RecruiterData.isRecruiterLoggedIn) {
      fetchRecruiterData();
    } else {
      setLoading(false); // Set loading to false if already logged in
    }
  }, [RecruiterData.isRecruiterLoggedIn, dispatch]);
  

  // Render Loading state or main layout
  return loading ? (
    <div className="w-full h-screen">
      <Loader />
    </div>
  ) : (
    <>
      <Header servedTo="recruiter"></Header>
      <div className="bg-sectionBackground">
        <Outlet/>
      </div>
      <Footer />
    </>
  );
}

export default RecruiterLayout;
