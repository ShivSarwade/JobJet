import React, { useEffect, useState } from "react";
import { Header, Footer, Loader } from "../../index";
import { Outlet, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentUser } from "../../../utils/user.utils";
import { logInUser } from "../../../app/Reducers/user.slice";

function UserLayout() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const [error, setError] = useState("");
  const userData = useSelector((state) => state.user);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const response = await getCurrentUser();
        console.log(response)
        if (response.error) {
          setError(response.error);
        } else {
          dispatch(logInUser(response));
        }
      } catch (error) {
        console.log("User not logged in:", error);
      } finally {
        setLoading(false);
      }
    };

    // Fetch user data only if not logged in
    if (!userData.isUserLoggedIn) {
      fetchUserData();
    } else {
      setLoading(false);
    }
  }, [dispatch, userData.isUserLoggedIn]); // Added dispatch to dependency array for best practices

  // Render loading state or main layout
  return loading ? (
    <div className="h-screen w-full">
      <Loader />
    </div>
  ) : (
    <>
      <Header servedTo="user" />
      <div className="bg-sectionBackground">
        <Outlet />
      </div>
      <Footer />
    </>
  );
}

export default UserLayout;
