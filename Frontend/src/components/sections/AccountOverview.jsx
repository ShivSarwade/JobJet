import React, { useState, useRef, useEffect } from "react";
import { Container, Button } from "..";
import Logo from "../../assets/male avatar.svg";
import { Link } from "react-router-dom";
import { recruiterVerification } from "../../utils/admin.utils";
function AccountOverview({ accountDetails = {}, PropertyNameObj = {} }) {
  const [status, setStatus] = useState(accountDetails.rVerificationStatus);
  const [view, setView] = useState(false);
  const ref = useRef();
  const verifyRef = useRef();
  console.log(accountDetails);

  useEffect(() => {
    console.log("View or status changed");
  }, [view, status]);

  function handleRecruiterStatusChange(recruiterId,Status) {
    setStatus(Status)
    if (!recruiterId) {
      console.error("Recruiter ID is required.");
      return;
    }
    recruiterVerification({recruiterId:recruiterId, verificationStatus:Status})
      .then((response) => {
        if (response === 200) {
          alert(`Recruiter ${Status} successfully!`);
        } else {
          alert(`Failed to ${Status} recruiter.`);
        }
      })
      .catch((error) => {
        console.error(`Error during recruiter ${Status}:`, error);
        alert(`Error during recruiter ${Status}.`);
      });
  }

  return (
    <Container
      className={`w-half min-w-[200px] h-auto shadow-md p-2 rounded-lg flex flex-col ${
        view ? "gap-2" : "gap-0"
      }`}
    >
      {/* Header Section */}
      <div className="flex justify-between items-center w-max min-w-full">
        <div className="flex items-center py-4 text-gray-900 whitespace-nowrap dark:text-white">
          <img
            className="w-6 h-6 sm:w-10 sm:h-10 rounded-full border border-primary"
            src={accountDetails.avatar ? accountDetails.avatar : Logo}
            alt="Profile image"
          />
          <div className="ps-3">
            <Link
              to={`recruiter/${accountDetails.rUserName}`}
              className="xs:text-xs sm:text-base font-primary font-bold text-primary capitalize"
            >
              {accountDetails.rCompanyName}
            </Link>
            <div className="text-[3vw] xs:text-xs sm:text-sm font-normal text-gray-400 ">
              {accountDetails.rEmail}
            </div>
          </div>
        </div>
        <Button
          className="px-2 aspect-square  bg-blue-200 text-blue-700 rounded-full text-sm"
          ref={ref}
          onClick={() => setView((prev) => !prev)}
        >
          <i
            className={`${
              view
                ? "fa-solid fa-eye text-primary"
                : "fa-solid fa-eye-slash text-accent"
            }`}
          ></i>
        </Button>
      </div>

      {/* Details Section */}
      <div
        className={`w-full flex flex-col overflow-hidden ${
          view ? "h-full p-2 gap-2" : "h-0 p-0 gap-0"
        }`}
      >
        {Object.entries(accountDetails).map(([key, value]) => {
          if (key !== "rCompanyName" && key !== "avatar" && key !== "rEmail") {
            if (key !== "rWebsite") {
              return (
                <div key={key} className="mb-2">
                  <strong className="xs:text-xs text-base font-primary font-bold text-primary">
                    {PropertyNameObj[key]}:
                  </strong>{" "}
                  <p className="xs:text-xs text-base font-primary capitalize">
                    {String(value)}
                  </p>
                </div>
              );
            } else {
              return (
                <div key={key} className="mb-2">
                  <strong className="xs:text-xs text-base font-primary font-bold text-primary">
                    {key}:
                  </strong>{" "}
                  <Link
                    to={value}
                    className="xs:text-xs text-base font-primary font-bold text-accent"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {value}
                  </Link>
                </div>
              );
            }
          }
          return null;
        })}

        {/* Status Buttons */}
        <Button
          ref={verifyRef}
          className={`p-2 w-full text-white rounded-md ${
            status === "verified" ? "bg-gray-600" : "bg-green-600"
          }`}
          onClick={() => {
            if (status !== "verified") {
              handleRecruiterStatusChange(accountDetails._id,"verified");
            }
          }}
        >
          {status === "verified" ? "Verified" : "Verify"}
        </Button>
        <Button
          ref={verifyRef}
          className={`p-2 w-full text-white rounded-md ${
            status === "rejected" ? "bg-gray-600" : "bg-red-600"
          }`}
          onClick={() => {
            if (status !== "rejected") {
              handleRecruiterStatusChange(accountDetails._id,"rejected")
            }
          }}
        >
          {status === "rejected" ? "Rejected" : "Reject"}
        </Button>
      </div>
    </Container>
  );
}

export default AccountOverview;
