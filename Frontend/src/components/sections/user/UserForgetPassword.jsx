import React, { useRef, useState, useEffect } from "react";
import { Container, InputElement, Button } from "../../index.js";
import Logo from "../../../assets/small.png";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { resetPassword } from "../../../utils/user.utils.js";
// import { logInRecruiter } from "../../../app/Reducers/recruiter.slice.js";

function UserForgetPassword() {

  // CHANGE THE NAME OF THIS COMPONENT IF YOU WANT TO 
  const [userInfo, setUserInfo] = useState({
    Email: "",
    // oldPassword: "",
    Password: "",
    ConfirmPassword: ""
  });
  const inputFields = [
    
    {
      type: "email",
      name: "Email",
      label: "Email",
      value: userInfo.Email,
    },
    
    {
      type: "password",
      name: "Password",
      label: "Password",
      value: userInfo.Password,
    },
    {
      type: "password",
      name: "ConfirmPassword",
      label: "Confirm Password",
      value: userInfo.ConfirmPassword,
    },
  ];
  const dispatch = useDispatch();
  const [error, setError] = useState("");
  const RecruiterLoggedIn = useSelector(
    (state) => state.recruiter.isRecruiterLoggedIn
  );
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prevInfo) => ({ ...prevInfo, [name]: value }));
  };

  useEffect(() => {
    if (RecruiterLoggedIn == true) {
      navigate("/recruiter");
    } else {
      console.log("staus ok");
    }
  });
  const handleSubmit = async (e) => {
    e.preventDefault();
      // const re = await createRecruiterAccount(recruiterInfo);
    if (userInfo.Password==userInfo.ConfirmPassword) {
      // setError(createRecruiterAccountResponse.error);
      console.log(userInfo);

      const newPassword=resetPassword(userInfo)

      if(newPassword.error)
      {
        setError(newPassword.error)
      }
    }
    else if(!(userInfo.Password==userInfo.ConfirmPassword))
    {
      setError("please enter same password in both the fields")
    }
     else {
      console.log(Response)
      setError("Please fill up all the fields")
      // dispatch(logInRecruiter(createRecruiterAccountResponse));
    }
    // try {
    // } catch (error) {
    //   console.log("create Recruiter error from RecruiterUtils", error);
    // } finally {
    //   console.log("create Recruiter Account complete");
    // }
  };
  return (
    <div className=" bg-blue-400 min-h-screen max-w-screen flex justify-center py-8 items-center gap-x-7 font-primary">
      <Container>
        <div className="h-navHeight w-full items-center p-2 gap-[0.2rem] m-0 flex max-[900px]:w-full max-h-16 py-4 my-4 justify-center">
          <img src={Logo} alt="" className=" h-full " />
          <h3 className="text-[7vw] xs:text-[1.5em] font-bold text-primary">
            Reset Password
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
           <div className="w-full flex justify-center py-2">
            
          </div> 
          <div>
            <Button
              className="bg-primary border-primary py-2 w-full rounded-md my-0 font-semibold text-[rgb(240,248,255)] cursor-pointer transition-all duration-300 text-[14px] hover:bg-[rgb(29,92,144)]"
              type="submit"
            >
              Reset password
            </Button>
          </div>
          
          <div className="text-base text-slate-600 text-center my-2">
            ------------or------------
          </div>
          <div className="h-auto pt-auto flex align-bottom ">
            <Button className="bg-transparent border-2 box-border text-slate-600 border-primary py-2 w-full rounded-md my-0 font-semibold  cursor-pointer transition-all duration-300 text-[14px] hover:text-slate-800 ">
            Remember your password?
            </Button>
          </div>
        </form>
      </Container>
    </div>
  );
}

export default UserForgetPassword;
