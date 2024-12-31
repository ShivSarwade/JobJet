import React, { useState } from "react";
import Loader from "../elements/Loader";
import Button from "../elements/form/Button";
import JobPostCard from "../sections/JobPostCard";
import { InputElement } from "..";
import { searchJob } from "../../utils/user.utils";
import SearchJob from "../../assets/searchjob.webp";
import Job from "../../assets/jobs.webp";

const SearchJobs = ({presentingTo="user"}) => {
  // States
  const [searchQuery, setSearchQuery] = useState({
    title: "",
    location: "",
  });
  const jobsPerPage = 9;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalJobs, setTotalJobs] = useState(1);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("Search Jobs Here");
  const totalPages = Math.ceil(totalJobs / jobsPerPage);

  // Fetch jobs based on filters
  const fetchJobs = async (page) => {
    setLoading(true); // Show loader immediately
    setMessage("Searching...");

    try {
      const response = await searchJob(
        searchQuery.title,
        searchQuery.location,
        jobsPerPage,
        page
      );

      if (response.error) {
        setMessage("No Jobs Found");
      } else {
        setJobs(response.jobPosts || []);
        console.log(response.jobPosts);
        
        setTotalJobs(response.totalJobs || 0); // Update total jobs
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
      setMessage("No Jobs Found");
    } finally {
      setLoading(false);
    }
  };

  // Handle page change (previous/next)
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage); // Update page immediately
    fetchJobs(newPage); // Fetch new data for the updated page
  };

  // Handle form submission (search)
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to the first page on new search
    fetchJobs(1); // Fetch jobs for the first page immediately
  };

  // Handle form reset
  const onReset = () => {
    setSearchQuery({
      title: "",
      location: "",
    });
    setJobs([]); // Clear the current job listings
    setMessage("Search Jobs Here"); // Reset the message
    setCurrentPage(1); // Reset to first page
  };

  return (
    <div className="min-h-screen bg-grey-200 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-primary pb-4">
          Find Your Dream Job
        </h1>

        {/* Search Form */}
        <form
          onSubmit={handleSearch}
          className="bg-white pt-2 pb-3 px-4 rounded-lg shadow-md flex flex-col sm:flex-row gap-4 mb-8"
        >
          <InputElement
            type="text"
            name="title"
            placeholder="Search by job title or keyword..."
            value={searchQuery.title}
            onChange={(e) =>
              setSearchQuery({ ...searchQuery, title: e.target.value })
            }
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
          />

          <InputElement
            type="text"
            name="location"
            placeholder="Location"
            value={searchQuery.location}
            onChange={(e) =>
              setSearchQuery({ ...searchQuery, location: e.target.value })
            }
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
          />

          {/* Search Button */}
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 focus:outline-none mt-2"
          >
            Search
          </button>

          {/* Reset Button */}
          <button
            type="button"
            className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 focus:outline-none mt-2"
            onClick={onReset}
          >
            Clear
          </button>
        </form>

        {/* Job Listings */}
        {loading ? (
          <Loader />
        ) : jobs.length > 0 ? (
          <div className="w-full container mx-auto max-w-screen-lg p-6 font-primary rounded-md bg-white">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map((job) => (
                <div className="w-full" key={job._id}>
                  <JobPostCard job={job} presentingTo={presentingTo} />
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-between items-center mt-4">
              <Button
                onClick={() =>
                  currentPage > 1 && handlePageChange(currentPage - 1)
                }
                disabled={currentPage === 1}
                className="px-4 py-2 bg-primary text-white rounded-lg transition duration-200 hover:bg-accent"
              >
                Previous
              </Button>

              <span>
                Page {currentPage} of {totalPages}
              </span>

              <Button
                onClick={() =>
                  currentPage < totalPages && handlePageChange(currentPage + 1)
                }
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-primary text-white rounded-lg transition duration-200 hover:bg-accent"
              >
                Next
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-600 flex flex-col items-center justify-center w-full h-full">
            <img
              src={message === "No Jobs Found" ? SearchJob : Job}
              className="sm:max-w-[400px] object-cover"
              alt="Job Search"
            />
            <span>{message}</span>
          </p>
        )}
      </div>
    </div>
  );
};

export default SearchJobs;
