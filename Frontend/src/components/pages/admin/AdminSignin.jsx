import React, { useRef, useState } from "react";
import { InputElement, Button, Container } from "../../index.js";
import Logo from "../../../assets/small.png";
import { Link } from "react-router-dom";
import { createAdminAccount } from "../../../utils/admin.utils.js";

function AdminSignIn() {
  const [adminInfo, setUserInfo] = useState({
    firstName: "",
    lastName: "",
    adminEmail: "",
    adminPassword: "",
    confirmPassword: "",
    securityKey: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);  // State to track success

  const inputFields = [
    {
      type: "text",
      name: "firstName",
      label: "First Name",
      value: adminInfo.firstName,
    },
    {
      type: "text",
      name: "lastName",
      label: "Last Name",
      value: adminInfo.lastName,
    },
    {
      type: "email",
      name: "adminEmail",
      label: "Email",
      value: adminInfo.adminEmail,
    },
    {
      type: "password",
      name: "adminPassword",
      label: "Password",
      value: adminInfo.adminPassword,
    },
    {
      type: "password",
      name: "confirmPassword",
      label: "Confirm Password",
      value: adminInfo.confirmPassword,
    },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prevInfo) => ({ ...prevInfo, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const createUserAdminResponse = await createAdminAccount(adminInfo);
      if (createUserAdminResponse.error) {
        setError(createUserAdminResponse.error);
      } else {
        setSuccess(true);  // Set success to true when the admin is created
      }
    } catch (error) {
      console.log("createadminaccount error from userSignin.jsx:", error);
    } finally {
      console.log("createadminaccount function complete");
    }
  };

  // Function to close the success modal
  const closeModal = () => setSuccess(false);

  return (
    <div className=" bg-blue-400 min-h-screen max-w-screen flex justify-center py-8 items-center gap-x-7 font-primary">
      <Container>
        <div className="h-navHeight w-full items-center p-2 gap-[0.2rem] mx-auto flex max-[900px]:w-full max-h-16 max-[400px]:h-[18vw] py-4 my-4 justify-center">
          <img src={Logo} alt="" className=" h-full max-[450px]:h-3/4" />
          <h3 className="text-[1.6em] font-bold text-primary">Admin Sign Up</h3>
        </div>
        <form action="#" className="flex flex-col gap-1 justify-between h-auto" onSubmit={handleSubmit}>
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
          <div className="w-full flex justify-center py-2"></div>
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
              have an account?{" "}
              <Link to="/admin/login" className="no-underline text-primary">
                Log In
              </Link>
            </p>
          </div>
        </form>

        {/* Success Popup */}
        {success && (
          <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-80">
              <h2 className="text-lg font-semibold text-green-500">Success!</h2>
              <p className="text-gray-700">The admin account was created successfully.</p>
              <div className="flex justify-center mt-4">
                <button
                  onClick={closeModal}
                  className="bg-primary text-white py-2 px-4 rounded-md"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}

export default AdminSignIn;
