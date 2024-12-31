import React, { useEffect, useState, useRef } from "react";
import { Logo, Button } from "../index";
import { Link, NavLink, useNavigate, useParams } from "react-router-dom";
import { nanoid } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { logOutUser } from "../../app/Reducers/user.slice";
import { logOutRecruiter } from "../../app/Reducers/recruiter.slice";
import { terminateUserSession } from "../../utils/user.utils";
import { terminateRecruiterSession } from "../../utils/recruiter.utils";

function Header({ servedTo = "user" }) {
  let { recruiterusername, username } = useParams()
  const navigate = useNavigate();
  const menuRef = useRef();
  const recruiter = useSelector(state => state.recruiter.recruiterData)
  const user = useSelector(state => state.user.userData)
  const dispatch = useDispatch();
  // State management
  const [collapsed, setCollapsed] = useState(false);
  const logInStatus = useSelector((state) =>
    servedTo === "user"
      ? state.user.isUserLoggedIn
      : state.recruiter.isRecruiterLoggedIn
  );

  const [menuItems, setMenuItems] = useState([]);

  // Menu item selections
  const loggedOutMenuItems = useSelector(
    (state) => state.staticPages.header.loggedOutUser
  );
  const userMenuItems = [
    { path: `/${username}`, text: "Profile", icon: "fa-solid fa-user" },
    {
      path: `${username}/jobs`,
      text: "Search Jobs",
      icon: "fa-solid fa-magnifying-glass",
    },
    {
      path: `/feedback-and-rate`,
      text: "Provide Feedback",
      icon: "fa-regular fa-comment",
    },
    {
      path: "/feedback-and-rate",
      text: "Feedback and Rate",
      icon: "fa-regular fa-envelope",
    },
    {
      path: "/recruiter/login",
      text: "Recruiters Login",
      icon: "fa-solid fa-user-tie",
    },
    {
      path: "/recruiter/register",
      text: "Recruiters Register",
      icon: "fa-solid fa-user-plus",
    },
    { path: "/about", text: "About Us", icon: "fa-solid fa-circle-info" },
    {
      path: "/terms-and-conditions",
      text: "Terms and Conditions",
      icon: "fa-solid fa-file-invoice",
    },
    {
      path: "/privacy-policy",
      text: "Privacy Policy",
      icon: "fa-solid fa-user-shield",
    }
  ]
  const recruiterMenuItems = [
    { path: "", text: "Profile", icon: "fa-solid fa-user-tie" },
    {
      path: `/recruiter/${recruiterusername}/all-jobs`,
      text: "Manage Job Postings",
      icon: "fa-solid fa-briefcase",
    },
    {
      path: `/recruiter/${recruiterusername}/search-jobs`,
      text: "Search Jobs",
      icon: "fa-solid fa-magnifying-glass",
    },
    {
      path: "/feedback-and-rate",
      text: "Feedback and Rate",
      icon: "fa-regular fa-envelope",
    },
    {
      path: "/login",
      text: "User Login",
      icon: "fa-solid fa-user-tie",
    },
    {
      path: "/register",
      text: "User register",
      icon: "fa-solid fa-user-plus",
    },
    { path: "/about", text: "About Us", icon: "fa-solid fa-circle-info" },
    {
      path: "/terms-and-conditions",
      text: "Terms and Conditions",
      icon: "fa-solid fa-file-invoice",
    },
    {
      path: "/privacy-policy",
      text: "Privacy Policy",
      icon: "fa-solid fa-user-shield",
    }
  ]

  // Handle menu collapse
  const handleMenuButtonClick = () => {
    setCollapsed((prev) => !prev);
  };

  // Handle logout
  const handleLogOut = async () => {
    try {
      if (servedTo === "user") {
        await terminateUserSession();
        dispatch(logOutUser());
      } else {
        await terminateRecruiterSession();
        dispatch(logOutRecruiter());
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Redirect based on button click
  const handleRedirectionButtonClick = (path) => {
    navigate(path);
  };

  // Update menu items and handle outside clicks
  useEffect(() => {
    // Update menu items based on login status and user type
    setMenuItems(
      logInStatus
        ? servedTo === "user"
          ? userMenuItems
          : recruiterMenuItems
        : loggedOutMenuItems
    );

    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target) && collapsed) {
        setCollapsed(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [
    servedTo,
    logInStatus,
    loggedOutMenuItems,
    collapsed,
  ]);

  return (
    <header className="overflow-hidden shadow-xl shadow-navShadow h-navHeight z-20 relative font-primary">
      <nav className="w-full h-full flex items-center justify-center gap-[1.5vw] px-[2.5vw] md:gap-4 py-2 md:px-4 bg-navBackground">
        <div className="w-auto h-full flex items-center grow">
          <Logo classNameCnt="h-full py-[2px] flex items-center mr-8 gap-1 no-underline text-primaryText" />
          <NavLink
            to={
              servedTo === "user"
                ? `/${username}/jobs`
                : `/recruiter/${recruiterusername}/post-a-job`
            }
            className={({ isActive }) =>
              `${isActive ? "text-accent" : ""} hidden md:block`
            }
          >
            {servedTo === "user" ? "Jobs" : "Post a Job"}
          </NavLink>
        </div>

        {/* Auth buttons for logged out users */}
        <div
          className={`w-max h-full items-center gap-4 ${logInStatus ? "hidden" : "hidden md:flex"
            }`}
        >
          <Button
            className="font-primary text-accent cursor-pointer text-[1rem] font-semibold bg-transparent border-2 border-accent border-solid rounded-3xl py-3 px-6 duration-300 hover:text-white hover:bg-accent"
            onClick={() =>
              handleRedirectionButtonClick(
                servedTo === "user" ? "/login" : "/recruiter/login"
              )
            }
          >
            Log In
          </Button>
          <Button
            className="font-primary text-white cursor-pointer text-[1rem] font-semibold bg-accent border-2 border-accent border-solid rounded-3xl py-3 px-6 duration-300 hover:text-accent hover:bg-transparent"
            onClick={() =>
              handleRedirectionButtonClick(
                servedTo === "user" ? "/register" : "/recruiter/register"
              )
            }
          >
            Sign Up
          </Button>
          <Link
            to={servedTo === "user" ? "recruiter/login" : "/login"}
            className="hidden md:block"
          >
            {servedTo === "user" ? "For Recruiters" : "For Applicants"}
          </Link>
        </div>

        {/* Menu toggle button */}
        <Button
          className="flex px-[1vw] aspect-square h-full cursor-pointer text-2xl rounded-full items-center justify-center hover:text-primary hover:bg-sectionBackground"
          onClick={handleMenuButtonClick}
        >
          <i className="fa-solid fa-bars"></i>
        </Button>

        {/* Collapsible menu */}
        <div
          className={`flex flex-col justify-between pt-6 pb-3 pl-6 pr-3 xs:pt-8 xs:pb-4 xs:pl-8 xs:pr-4 min-w-[220px] w-3/4 lg:w-2/5 h-[100dvh] bg-darkBackground fixed top-0 rounded-tl-3xl transition-[right] duration-200 z-10 ${collapsed ? "right-0" : "-right-full"
            }`}
          ref={menuRef}
        >
          <div className="flex flex-col gap-4">
            <Button
              className="text-primaryBackground flex items-center gap-2 transition-all duration-200 aspect-square w-max h-min cursor-pointer text-2xl rounded-full justify-center p-[2vw] md:p-[0.5vw] hover:text-primaryBackground hover:bg-darkSection"
              onClick={handleMenuButtonClick}
            >
              <i className="fa-solid fa-close"></i>
            </Button>
            {menuItems.map((menuItem) =>
              logInStatus ? (
                servedTo == "user" ? (
                  <NavLink
                    to={menuItem.path}
                    className={({ isActive }) =>
                      `${isActive ? "text-accent" : "text-primaryBackground"
                      } h-max rounded-sm flex items-center justify-start gap-2 transition-all duration-200 hover:bg-darkSection hover:translate-x-[1%]`
                    }
                    key={nanoid()}
                  >
                    <i
                      className={`min-w[30px] w-[4vw] pr-[3vw] xs:pl-[1vw] ${menuItem.icon}`}
                    ></i>
                    {menuItem.text}
                  </NavLink>
                ) : (
                  <NavLink
                    to={menuItem.path}
                    className={({ isActive }) =>
                      `${isActive ? "text-accent" : "text-primaryBackground"
                      } h-max rounded-sm flex items-center justify-start gap-2 transition-all duration-200 hover:bg-darkSection hover:translate-x-[1%]`
                    }
                    key={nanoid()}
                  >
                    <i
                      className={`min-w[30px] w-[4vw] pr-[3vw] xs:pl-[1vw] ${menuItem.icon}`}
                    ></i>
                    {menuItem.text}
                  </NavLink>
                )
              ) : (
                <NavLink
                  to={menuItem.path}
                  className={({ isActive }) =>
                    `${isActive ? "text-accent" : "text-primaryBackground"
                    } h-max rounded-sm flex items-center justify-start gap-2 transition-all duration-200 hover:bg-darkSection hover:translate-x-[1%]`
                  }
                  key={nanoid()}
                >
                  <i
                    className={`min-w[30px] w-[4vw] pr-[3vw] xs:pl-[1vw] ${menuItem.icon}`}
                  ></i>
                  {menuItem.text}
                </NavLink>
              )
            )}
          </div>

          {/* Logout and alternate login buttons */}
          <div className="flex flex-col gap-2 pb-2">
            {logInStatus && (
              <Button
                className="font-primary text-white cursor-pointer text-[1rem] font-semibold bg-accent border-2 border-accent border-solid rounded py-1 px-6 duration-300 gap-[1vw] hover:text-accent hover:bg-transparent justify-center items-center"
                onClick={handleLogOut}
              >
                <i className="pl-[1vw] fa-solid fa-sign-out"></i>
                Log Out
              </Button>
            )}
            {!logInStatus && (
              <>
                <Button
                  className="font-primary w-full text-white cursor-pointer text-[1rem] font-semibold bg-accent border-2 border-accent border-solid rounded py-1 px-6 duration-300 gap-[1vw] hover:text-accent hover:bg-transparent justify-center items-center md:hidden"
                  onClick={() =>
                    handleRedirectionButtonClick(
                      servedTo === "user" ? "/login" : "/recruiter/login"
                    )
                  }
                >
                  <i className="pl-[1vw] fa-solid fa-sign-in"></i>
                  Log In
                </Button>
                <Button
                  className="font-primary text-white cursor-pointer text-[1rem] font-semibold bg-accent border-2 border-accent border-solid rounded py-1 px-6 duration-300 gap-[1vw] hover:text-accent hover:bg-transparent md:hidden justify-center items-center"
                  onClick={() =>
                    handleRedirectionButtonClick(
                      servedTo === "user" ? "/register" : "/recruiter/register"
                    )
                  }
                >
                  <i className="pl-[1vw] fa-solid fa-sign-in"></i>
                  Sign Up
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;
