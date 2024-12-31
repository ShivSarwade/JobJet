import React, { useEffect, useRef, useState } from 'react';
import { Container, InputLabelElement, Button } from "../index";
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import { feedbackAndRate } from '../../utils/common.utils';

function FeedbackAndRate({ servedTo = "user" }) {
  const rating = [
    { id: 1, icon: 'fa-regular fa-face-angry', label: 'Angry', color: "text-red-500" },
    { id: 2, icon: 'fa-regular fa-face-frown', label: 'Sad', color: "text-orange-500" },
    { id: 3, icon: 'fa-regular fa-face-meh', label: 'Neutral', color: "text-yellow-300" },
    { id: 4, icon: 'fa-regular fa-face-smile', label: 'Happy', color: "text-lime-500" },
    { id: 5, icon: 'fa-regular fa-face-laugh-beam', label: 'Very Happy', color: "text-green-500" },
  ];

  const navigate = useNavigate();
  const [value, setValue] = useState({
    email: "",
    rating: null,
    feedback: ""
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
    if (value.email && value.rating !== null && value.feedback) {
      console.log(value);
      setIsPopUpOpen(true);
      setError(false);

      const feedback=feedbackAndRate(value)
      if(feedback.error)
      {
        setError(feedback.error)
      }

    } else {
      setError("Please fill up all the fields");
    }
  };

  useEffect(() => {
    console.log(isClientLoggedIn);
    console.log(userEmail);

    setValue(prevInfo => ({ ...prevInfo, email: userEmail }));
  }, [userEmail]); // Update value when userEmail changes

  return (
    <>
      <form onSubmit={handleSubmit} className='z-100 w-full bg-blue-400 min-h-screen flex items-center justify-center relative'>
        <Container>
          <h1 className="text-[10vw] xs:text-2xl font-bold w-full py-4 text-center text-primary">
            Share your Feedback
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

          <div className="flex flex-col w-full h-max py-2">
            <h3 className='block mb-2 text-sm text-slate-600'>How would you rate your experience?</h3>
            <div className="flex items-center justify-between gap-1">
              {rating.map((option) => (
                <label key={option.id} className="flex flex-col items-center justify-center cursor-pointer mx-2">
                  <input
                    type="radio"
                    name="rating"
                    value={option.label}
                    checked={value.rating === option.label}
                    onChange={handleChange}
                    className="hidden"
                  />
                  <span className={`${value.rating === option.label ? option.color : 'text-gray-400'}`}>
                    <i className={`text-[10vw] xs:text-3xl ${option.icon}`}></i>
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="py-2">
            <InputLabelElement
              required
              label="Tell us about your experience"
              type="textarea"
              value={value.feedback}
              placeholder="type here"
              rows="5"
              name="feedback"
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
                Your feedback has been submitted successfully.
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

export default FeedbackAndRate;
