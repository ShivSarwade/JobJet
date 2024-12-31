import React, { useState, useEffect } from "react";
import { InputElement, Button, Container } from "../../index.js";
import Logo from "../../../assets/small.png";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createUserSession } from "../../../utils/user.utils.js";
import { logInUser } from "../../../app/Reducers/user.slice.js";

function UserLogin() {
  const [userInfo, setUserInfo] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const username = useSelector(state=>state.user.userData.username)
  const inputFields = [
    { type: "email", name: "email", label: "Email", value: userInfo.email },
    {
      type: "password",
      name: "password",
      label: "Password",
      value: userInfo.password,
    },
  ];

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userLoggedIn = useSelector((state) => state.user.isUserLoggedIn);

  const handleChange = (e) => {
    setError("")
    const { name, value } = e.target;
    setUserInfo((prevInfo) => ({ ...prevInfo, [name]: value }));
  };

  useEffect(() => {
    if (userLoggedIn) {
      navigate(`/${username}`);
    } else {
      console.log("status ok from userlogin");
    }
  }, [userLoggedIn, navigate]); // Added dependency array

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // console.log(userInfo);
      const Response = await createUserSession(userInfo);
      if (Response.error) {
        setError(Response.error);
      } else {
        // console.log(Response.user)
        
        dispatch(logInUser(Response.user));
      }
    } catch (error) {
      console.error("Login error from userlogin:",error); // Improved error handling
    } finally {
      console.log("Handle Submit function Complete from userlogin:");
    }
  };

  return (
    <div className="bg-blue-400 h-screen max-w-screen flex justify-center py-8 items-center gap-x-7 font-primary">
      <Container>
        <div className="h-navHeight w-full items-center p-2 gap-[0.2rem] mx-auto flex max-[900px]:w-full max-h-16 py-4 my-4 justify-center">
          <img src={Logo} alt="Logo" className="h-full" />
          <h3 className="text-[1.6em] font-bold text-primary">Log In</h3>
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
              Don't have an account?
              <Link to="/register" className="no-underline text-primary">
                Sign up
              </Link>
            </p>
          </div>
          <div className="text-base text-slate-600 text-center my-2">
            ------------or------------
          </div>
          <div className="h-auto flex align-bottom">
            <Link to='/recruiter/login' className="text-center bg-transparent border-2 box-border text-slate-600 border-primary py-2 w-full rounded-md my-0 font-semibold cursor-pointer transition-all duration-300 text-[14px] hover:text-slate-800">
             Not a User ?
            </Link>
          </div>
        </form>
      </Container>
    </div>
  );
}

export default UserLogin;
