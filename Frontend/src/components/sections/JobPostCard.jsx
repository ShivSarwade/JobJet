import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AdminSignIn, Button } from "../index";
import { Link } from "react-router-dom";

import Company from "../../assets/CompanyAvatar.png"

function JobPostCard({ job = {}, presentingTo = "user" }) {
  const navigate = useNavigate(); // useNavigate to handle programmatic navigation
  const { recruiterusername, username } = useParams();

  // Construct the links based on recruiter username and job id
  const recruiterJobLink = `/recruiter/${job.jobPostCompany.rUserName}/jobs/${job._id}`;  // Editable route for recruiter
  const userJobLink = `/jobs/${job.jobPostCompany.rUserName}/${job._id}`; // View-only route for user
  const adminLink = `/admin/recruiter/${job.jobPostCompany.rUserName}/${job._id}`
  return (
    <div
      key={job.id}
      className="bg-white p-4 rounded-lg h-full shadow-md hover:shadow-lg transition-all flex flex-col justify-between"
    >
      <div className="flex flex-col sm:flex-row items-center sm:items-start sm:space-x-4">
        <img
          src={job.jobPostCompany.avatar?job.jobPostCompany.avatar:Company}
          alt={job.jobPostCompany.rCompanyName}  // Access rCompanyName from jobPostCompany
          className="w-16 h-16 object-cover rounded-md mb-4 sm:mb-0"
        />
        <div className="text-center sm:text-left">
          {/* Link based on user type, viewing for users, editable for recruiters */}
          <Link
            to={userJobLink}  // Default link (view-only route for users)
            className="font-semibold text-primary hover:underline"
          >
            {job.jobPostName}
          </Link>
          <Link to={presentingTo === "user" ? `/${username}/recruiter/${job.jobPostCompany.rUserName}` : `/recruiter/${job.jobPostCompany.rUserName}`} className="block text-xs font-[500] text-black">
            {job.jobPostCompany.rCompanyName} {/* Access company name */}
          </Link>
          <p className="text-xs text-gray-600 mt-1">{job.jobPostAddress}</p>
        </div>
      </div>

      {/* View, Apply, and Edit buttons */}
      <div className="mt-4">
        <div className="w-full flex flex-col sm:flex-row justify-end gap-2 items-center">
          <Button
            onClick={() => {
              if (presentingTo === "user") {
                navigate(`/${username}/jobs/${job.jobPostCompany.rUserName}/${job._id}`); // Navigate to recruiter page for user
              } else if(presentingTo === "recruiter"){
                navigate(recruiterJobLink); // Navigate to editable page for recruiter
              } else if(presentingTo === "admin"){
                navigate(adminLink)
              }
            }}
            className="w-full px-4 py-2 bg-primary text-white rounded-lg active:bg-accent transition duration-200 mb-2 sm:mb-0"
          >
            View
          </Button>
        </div>
      </div>
    </div>
  );
}

export default JobPostCard;
