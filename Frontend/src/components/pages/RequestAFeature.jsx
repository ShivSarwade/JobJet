import React, { useRef, useState, useEffect } from 'react';
import { Container, InputLabelElement, Button } from "../index";
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import { requestAFeature } from '../../utils/common.utils';
import axios from 'axios';

function RequestAFeature({servedTo="user"}) {

  const navigate = useNavigate();
  const [value, setValue] = useState({
    email:"",
    featureName: "",
    featureDescription: ""
  });
  
  const [error, setError] = useState(false);
  const [isPopUpOpen, setIsPopUpOpen] = useState(false);
  const isClientLoggedIn = useSelector(state => {
    if (servedTo === "recruiter") {
      return state.recruiter.isRecruiterLoggedIn
    } else if (servedTo === "admin") {
      return state.admin.isAdminLoggedIn
    } else {
      return state.user.isUserLoggedIn
    }
  })
  const userEmail = isClientLoggedIn ? useSelector(state => {
    if (servedTo === "recruiter") {
      return state.recruiter.recruiterData.email
    } else if (servedTo === "admin") {
      return state.admin.adminData.email
    } else if (servedTo === "user") {
      return  state.user.userData.email
    }
  }) : "";


  useEffect(() => {
    console.log(isClientLoggedIn);
    console.log(userEmail);

    setValue(prevInfo => ({ ...prevInfo, email: userEmail }));
  }, [userEmail]); // Update value when userEmail changes


  const handleChange = (e) => {
    const { name, value } = e.target;
    setValue(prevInfo => ({ ...prevInfo, [name]: value }));
  };

  const handleClosePopup = () => {
    navigate("/");
    setIsPopUpOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (value.email && value.featureName && value.featureDescription) {
      console.log(value);
      setIsPopUpOpen(true);
      setError(false);

      const featureRequestRes=requestAFeature(value)
      if(featureRequestRes.error)
      {
        setError(featureRequestRes.error)
      }
    } 

    else {
      setError("Please fill up all the fields");
    }
  };


  return (
    <>
      <form onSubmit={handleSubmit} className='w-full bg-blue-400 min-h-screen flex items-center justify-center relative'>
        <Container>
          <h1 className="text-[10vw] xs:text-2xl font-bold w-full py-4 text-center text-primary">
            Request A Feature
          </h1>
          
          <h1 className={`${error ? "block mb-2" : "hidden"} text-sm text-red-500`}>
            {error}
          </h1>
          <InputLabelElement
            type="email"
            name="email"
            placeholder="test@gmail.com"
            value={value.email}
            label="Enter your Email:"
            onChange={handleChange}
            required
            ref={useRef()}
          />
          <InputLabelElement
            type="text"
            name="featureName"
            placeholder="Enter Feature Name"
            value={value.featureName}
            label="Feature Name:"
            onChange={handleChange}
            required
            ref={useRef()}
          />
          
          
          
          <div className="py-2">
            <InputLabelElement
              required
              label="Feature Discription"
              type="textarea"
              value={value.featureDescription}
              placeholder="type here"
              rows="5"
              name="featureDescription"
              onChange={handleChange}
            />
          </div>
          
          <Button type="submit">Submit</Button>
        </Container>

        <div className={`${isPopUpOpen ? "flex" : "hidden"} w-full items-center justify-center h-full absolute top-0 left-0 backdrop-blur-md`}>
          <div className="w-full min-w-[200px] max-w-[300px] xs:w-max rounded bg-blue-600">
            <div className="bg-white p-[4vw] xs:p-6 rounded shadow-md">
              <h2 className="text-center text-[15vw] xs:text-4xl font-bold font-primary text-accent pt-4 pb-2">
                Thank You!
              </h2>
              <p className='text-center text-sm xs:text-lg pb-2'>
                Your request has been submitted successfully.
              </p>
              <div className="flex flex-col w-full justify-center pt-4">
                <Button type="button" onClick={handleClosePopup}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}

export default RequestAFeature;
