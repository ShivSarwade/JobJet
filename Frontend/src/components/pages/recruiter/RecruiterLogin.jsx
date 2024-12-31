import React, { useEffect, useRef, useState } from "react";
import { InputElement, Button, Container } from "../../index.js";
import Logo from "../../../assets/small.png";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logInRecruiter } from "../../../app/Reducers/recruiter.slice.js";
import { createRecruiterSession } from "../../../utils/recruiter.utils.js";
function RecruiterLogin() {
  const [recruiterInfo, setRecruiterInfo] = useState({
    rEmail: "",
    rPassword: "",
  });
  const [error, setError] = useState("");
  const inputFields = [
    {
      type: "email",
      name: "rEmail",
      label: "Email",
      value: recruiterInfo.rEmail,
    },
    {
      type: "password",
      name: "rPassword",
      label: "Password",
      value: recruiterInfo.rPassword,
    },
  ];

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const recruiter = useSelector(
    (state) => state.recruiter
  );

  const handleChange = (e) => {
    setError("")

    const { name, value } = e.target;
    setRecruiterInfo((prevInfo) => ({ ...prevInfo, [name]: value }));
  };

  useEffect(() => {
    console.log(recruiter)
    if (recruiter.isRecruiterLoggedIn == true) {
      console.log("hello")
      navigate(`/recruiter/${recruiter.recruiterData.rUserName}`);
    } else {
      console.log("staus ok from recruiterlogin");
    }
  }, [recruiter, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(recruiterInfo);
    try {
      const Response = await createRecruiterSession(recruiterInfo);
      if (Response.error) {
        setError(Response.error);
      } else {
        console.log(Response)
        dispatch(logInRecruiter(Response));
      }
    } catch(error) {
      console.error("Login error from recruiterlogin:", error); // Improved error handling
    } finally {
      console.log("Handle Submit function Complete from recruiterlogin:");
    }
  };
  return (
    <div className=" bg-blue-400 h-screen max-w-screen flex justify-center py-8 items-center gap-x-7 font-primary">
      <Container>
        <div className="h-navHeight w-full items-center p-2 gap-[0.2rem] mx-auto flex max-[900px]:w-full max-h-16  py-4 my-4 justify-center">
          <img src={Logo} alt="" className=" h-full" />
          <h3 className="text-[8vw] xs:text-[1.6em] font-bold text-primary ">
            Recruiter Log In
          </h3>
        </div>
        <form
          className="flex flex-col gap-1 justify-between h-auto"
          onSubmit={handleSubmit}
        >
          <div
            className={`rounded w-full text-red-500 border-2 px-2 py-1 border-red-500 ${
              error ? "block" : "hidden"
            }`}
          >
            {error}
          </div>
          <div className="flex flex-col gap-4">
            {inputFields.map((field) => (
              <InputElement
                type={field.type}
                name={field.name}
                placeholder={field.label}
                value={field.value}
                onChange={handleChange}
                key={field.name}
                ref={useRef()}
                required
              />
            ))}
          </div>
          <div className="w-full flex justify-center ">
            <a
              href='/reset-password'
              className="px-[0px] py-5 no-underline hover:no-underline text-sm text-center text-primary font-[500]"
            >
              Forget password?
            </a>
          </div>
          <div>
            <Button
              className="bg-primary border-primary py-2 w-full rounded-md my-0 font-semibold text-[rgb(240,248,255)] cursor-pointer transition-all duration-300 text-[14px] hover:bg-[rgb(29,92,144)]"
              type="submit"
            >
              Sign in
            </Button>
          </div>
          <div className="text-sm text-center py-2">
            <p>
              Don't have a account?
              <Link
                to="/recruiter/register"
                className="no-underline text-primary"
              >
                Sign up
              </Link>
            </p>
          </div>
          <div className="text-base text-slate-600 text-center my-2">
            ------------or------------
          </div>
          <div className="h-auto pt-auto flex align-bottom ">
            <Link to='/login' className="text-center bg-transparent border-2 box-border text-slate-600 border-primary py-2 w-full rounded-md my-0 font-semibold  cursor-pointer transition-all duration-300 text-[14px] hover:text-slate-800 ">
              Not a Recruiter ?
            </Link>
          </div>
        </form>
      </Container>
    </div>
  );
}

export default RecruiterLogin;
