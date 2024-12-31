import React, { useRef, useState, useEffect } from "react";
import { Container, InputElement, Button } from "../../index.js";
import Logo from "../../../assets/small.png";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  createUserAccount,
  createUserSession,
} from "../../../utils/user.utils.js";
import { logInUser } from "../../../app/Reducers/user.slice.js";
function UserSignIn() {
  const [userInfo, setUserInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const inputFields = [
    {
      type: "text",
      name: "firstName",
      label: "First Name",
      value: userInfo.firstName,
    },
    {
      type: "text",
      name: "lastName",
      label: "Last Name",
      value: userInfo.lastName,
    },
    { type: "email", name: "email", label: "Email", value: userInfo.email },
    {
      type: "password",
      name: "password",
      label: "Password",
      value: userInfo.password,
    },
    {
      type: "password",
      name: "confirmPassword",
      label: "Confirm Password",
      value: userInfo.confirmPassword,
    },
  ];
  const dispatch = useDispatch();

  const userLoggedIn = useSelector((state) => state.user.isUserLoggedIn);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setError("")
    const { name, value } = e.target;
    setUserInfo((prevInfo) => ({ ...prevInfo, [name]: value }));
  };

  useEffect(() => {
    if (userLoggedIn == true) {
      navigate("/");
    } else {
      console.log("staus ok");
    }
  });
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const createUserAccountResponse = await createUserAccount(userInfo);
      if (createUserAccountResponse.error) {
        setError(createUserAccountResponse.error);
      } else {
        dispatch(logInUser(createUserAccountResponse));
      }
    } catch (error) {
      console.log("createuseraccount error from userSignin.jsx:", error);
    } finally {
      console.log("createuseraccount function complete");
    }
  };
  return (
    <div className=" bg-blue-400 min-h-screen max-w-screen flex justify-center py-8 items-center gap-x-7 font-primary">
      <Container>
        <div className="h-navHeight w-full items-center p-2 gap-[0.2rem] mx-auto flex max-[900px]:w-full max-h-16  py-4 my-4 justify-center">
          <img src={Logo} alt="" className=" h-full" />
          <h3 className="text-[1.6em] font-bold text-primary">Sign Up</h3>
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
          <div className="w-full flex justify-center py-2">
            
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
              {" "}
              have a account?
              <Link to="/login" className="no-underline text-primary">
                Log In
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
          {/* <div className="text-base text-slate-600 text-center my-2">
            ------------or------------
          </div> */}
          {/* <div className="h-auto pt-auto flex align-bottom ">
            <Button className="bg-transparent border-2 box-border text-slate-600 border-primary py-2 w-full rounded-md my-0 font-semibold  cursor-pointer transition-all duration-300 text-[14px] hover:text-slate-800 ">
              Not a User
            </Button>
          </div> */}
        </form>
      </Container>
    </div>
  );
}

export default UserSignIn;
