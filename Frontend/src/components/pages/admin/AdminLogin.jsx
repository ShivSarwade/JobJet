import React, { useRef, useEffect, useState } from "react";
import { InputElement, Button, Container } from "../../index.js";
import Logo from "../../../assets/small.png";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { createAdminSession } from "../../../utils/admin.utils.js";
import { logInAdmin } from "../../../app/Reducers/admin.slice.js";
import { useDispatch } from "react-redux";
function AdminLogin() {
  const [adminInfo, setAdminInfo] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  // const admin = useSelector(state=>state.admin.adminDate.adminUserName)

  const inputFields = [
    { type: "email", name: "email", label: "Email", value: adminInfo.email },
    {
      type: "password",
      name: "password",
      label: "Password",
      value: adminInfo.password,
    },
  ];

  const handleChange = (e) => {
    setError("")
    const { name, value } = e.target;
    setAdminInfo((prevInfo) => ({ ...prevInfo, [name]: value }));
  };

  const adminLoggedIn = useSelector((state) => state.admin.isAdminLoggedIn);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (adminLoggedIn) {
      navigate("/admin");
    } else {
      console.log("staus ok");
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("")
    try {
      const Response = await createAdminSession(adminInfo);
      console.log(Response);
      // navigate
      if (Response.error) {
        // console.log(Response.error);

        setError(Response.error);
      } else {
        console.log(Response.admin);
        dispatch(logInAdmin(Response.admin));
      }
    } catch (error) {
      console.error("Login error from adminlogin:", error); // Improved error handling
    } finally {
      console.log("Handle Submit function Complete from adminlogin:");
    }
  };

  return (
    <div className=" bg-blue-400 h-screen max-w-screen flex justify-center py-8  px-4 items-center gap-x-7 font-primary">
      <Container>
        <div className="h-navHeight w-full  items-center p-2 gap-[0.2rem] mx-auto flex max-[900px]:w-full max-h-16 max-[400px]:h-[18vw] py-4 my-4 justify-center">
          <img src={Logo} alt="" className=" h-full max-[450px]:h-3/4" />
          <h3 className="text-[1.4rem] font-bold text-primary">Admin Log In</h3>
        </div>
        <form
          action="#"
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
              />
            ))}
          </div>
          <div className="w-full flex justify-center py-2 ">
            
          </div>
          <div>
            <Button
              className="bg-primary border-primary py-2 w-full rounded-md my-0 font-semibold text-[rgb(240,248,255)] cursor-pointer transition-all duration-300 text-[14px] hover:bg-[rgb(29,92,144)]"
              type="submit"
            >
              Log in
            </Button>
          </div>
        </form>
      </Container>
    </div>
  );
}

export default AdminLogin;
