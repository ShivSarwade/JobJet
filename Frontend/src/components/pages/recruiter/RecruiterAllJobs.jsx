import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button, JobPostCard, Loader } from "../../index"; // Ensure these components exist
import { getJobPostByRecruiterUsername } from "../../../utils/jobPost.util"; // Make sure the utility is working
import { useSelector } from "react-redux";

function RecruiterAllJobs({ presentingTo = "user",companyname="CompanyName" }) {
  const { recruiterusername } = useParams();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalJobs, setTotalJobs] = useState(1);
  const jobsPerPage = 9;
  console.log(companyname);
  
  // Get current recruiter from Redux if presentingTo is 'recruiter'
  const currentRecruiter =
    presentingTo === "recruiter" ? useSelector((state) => state.recruiter.recruiterData.rUserName) : "";

  // Function to fetch job posts from the API based on recruiter username
  useEffect(() => {
    const fetchJobsByUsername = async () => {
      setLoading(true);
      setError("");

      try {
        // Fetch job posts by recruiter username with pagination
        const response = await getJobPostByRecruiterUsername(recruiterusername, jobsPerPage, currentPage);
        
        if (response.error) {
          throw new Error(response.error);
        }

        setJobs(response.jobPosts);  // Set jobs from response
        setTotalJobs(response.totalJobs);  // Set total job count
      } catch (err) {
        setError(err.message); // Handle any errors from API
      } finally {
        setLoading(false);  // Stop loading after fetching
      }
    };

    fetchJobsByUsername();  // Call the fetch function
  }, [recruiterusername, currentPage]);

  const totalPages = Math.ceil(totalJobs / jobsPerPage);  // Calculate total number of pages

  return (
    <div className="min-h-sectionHeight w-full py-4">
      <div className="w-full text-center py-4 text-3xl text-wrap font-bold text-primary  ">
        <h1 className="">All Jobs Posted By {recruiterusername}</h1>
      </div>
      <div className="transition-all duration-150 w-full container mx-auto max-w-screen-lg p-6 font-primary rounded-md bg-white">
        {/* Loading Spinner if loading */}
        {loading ? (
          <div className="h-full min-h-[30vh] sm:min-h-[60vh] w-full flex items-center justify-center">
            <Loader />  {/* Assuming you have a Loader component */}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Error message */}
            {error && <p className="w-full text-center text-xl text-red-500">{error}</p>}

            {/* Display jobs or message if no jobs */}
            {jobs.length === 0 ? (
              <p className="w-full text-center text-xl text-gray-500">No jobs have been posted yet.</p>
            ) : (
              jobs.map((job) => {
                console.log(`Job ID: ${job._id}`); // Log each job._id to check it
                return (
                  <div className="w-full" key={job._id}>
                    {/* Ensure the correct URL structure with /job/{job._id} */}
                   
                      <JobPostCard job={job} presentingTo={presentingTo} />
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Pagination Controls */}
        <div className="flex flex-col justify-between items-center xs:flex-row mt-4 flex-wrap gap-2">
          <Button
            onClick={() => setCurrentPage(prevPage => Math.max(prevPage - 1, 1))}
            disabled={currentPage === 1}
            className="text-[6vw] xs:text-sm w-full xs:w-max px-4 py-2 bg-primary text-white rounded-lg transition duration-200 hover:bg-accent"
          >
            Previous
          </Button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <Button
            onClick={() => setCurrentPage(prevPage => Math.min(prevPage + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="text-[6vw] xs:text-sm w-full xs:w-max px-4 py-2 bg-primary text-white rounded-lg transition duration-200 hover:bg-accent"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

export default RecruiterAllJobs;
