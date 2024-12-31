import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button, JobPostCard, Loader } from "../../index";
import { getJobPostByRecruiterUsername } from "../../../utils/jobPost.util";

function PostedJobRecruiterSecion({
  recruiterData = {},
  isEditable = false, // Add the isEditable prop
  presentingTo = "user",
}) {
  const navigate = useNavigate(); // Move useNavigate here
  const { recruiterusername,username } = useParams();
  const [Loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [jobs, setJobs] = useState([]);
  const [totalJobs, setTotalJobs] = useState(0);
  useEffect(() => {
    setError("");
    setLoading(true);
    const fetchJobsByUsername = async () => {
      const response = await getJobPostByRecruiterUsername(
        recruiterusername,
        6
      );
      if (response.error) {
        setError(response.error);
        return 0;
      }

      setJobs(response.jobPosts);
      setTotalJobs(response.totalJobs);
    };
    fetchJobsByUsername();
    setLoading(false);
  }, []);

  return Loading ? (
    <Loader />
  ) : (
    <section className="w-full max-w-screen-lg container mx-auto p-6 font-primary">
      {/* Header Section with Flexbox */}
      <div className="flex items-center justify-center sm:justify-between mb-6 flex-wrap gap-4">
        {/* Title */}
        <div className="flex gap-4 flex-wrap text-center items-center justify-center">
          <h2 className="text-xl xs:text-3xl font-[700] text-primary">Total Job Posted</h2>
          <h3 className=" text-xl xs:text-3xl font-[700] text-accent">{totalJobs}</h3>
        </div>
        {/* Conditionally render "Post New Job" button based on isEditable */}
        <div className="flex gap-4 flex-wrap justify-center">
          {isEditable && (
            <Link to={`/recruiter/${recruiterData.rUserName}/post-a-job`}>
              <Button className="px-6 py-2 bg-accent text-white rounded-lg transition duration-200 hover:bg-primary">
                Post New Job
              </Button>
            </Link>
          )}

          {totalJobs > 6 ? (
            <Link
              to={
                presentingTo == "user"
                  ? `/${username}/jobs/${recruiterData.rUserName}/all-jobs`
                  : "all-jobs"
              }
            >
              <Button className="px-6 py-2 bg-primary text-white rounded-lg transition duration-200 hover:bg-accent">
                Show All Jobs
              </Button>
            </Link>
          ) : (
            ""
          )}
        </div>
      </div>

      {/* Responsive grid layout using grid system */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.length > 0 ? (
          jobs.map((job) => (
            <div className="w-full" key={job._id}>
              <JobPostCard job={job} presentingTo={presentingTo}  />
            </div>
          ))
        ) : (
          <h3 className="w-full text-center text-2xl text-darkSection">
            No Jobs Posted yet
          </h3>
        )}
      </div>
    </section>
  );
}

export default PostedJobRecruiterSecion;
