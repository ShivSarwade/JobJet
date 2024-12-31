import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router';
import { EditorElement, InputLabelElement } from '../..';
import { setJobPost, addSkill, removeSkill, resetJobPost } from '../../../app/Reducers/jobpost.slice.js'; // Add resetJobPost
import { createOrUpdateJobPost, getJobPostByJobId } from '../../../utils/jobPost.util.js'; // Adjust path if needed
import SuccessPopUp from '../../sections/SuccessPopUp.jsx'; // Import the SuccessModal component

function PostAJob() {
  const { recruiterusername, jobid } = useParams(); // Get recruiterusername and jobid from params
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const recruiter = useSelector(state => state.recruiter.recruiterData);
  const jobPost = useSelector(state => state.jobPost);

  const [newSkill, setNewSkill] = useState('');
  const [error, setError] = useState('');
  const [submissionStatus, setSubmissionStatus] = useState('');
  const [isConfirmed, setIsConfirmed] = useState(false); // New state for confirmation checkbox
  const [showSuccessPopUp, setShowSuccessPopUp] = useState(false); // State to control modal visibility
  const [job, setJob] = useState({});

  // Function to handle job post changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(setJobPost({ [name]: value }));
  };

  const handleSkillsChange = (e) => {
    setNewSkill(e.target.value);
  };

  const handleAddSkill = () => {
    if (typeof newSkill === 'string' && newSkill.trim()) {
      dispatch(addSkill(newSkill));
      setNewSkill('');
    } else {
      console.error('Invalid skill:', newSkill);
    }
  };

  const validateJobPost = () => {
    const requiredFields = [
      jobPost.jobPostName,
      jobPost.jobPostDescription,
      jobPost.jobPostAddress,
      jobPost.jobPostType,
      jobPost.jobPostMode,
      jobPost.jobPostLevel,
      jobPost.jobPostQualification,
      jobPost.jobPostVacancies,
    ];
    return requiredFields.every(field => field);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isConfirmed) {
      setError('Please confirm before submitting the job post.');
      return;
    }

    if (!validateJobPost()) {
      setError('Please fill out all required fields before submitting.');
      return;
    }

    try {
      const response = await createOrUpdateJobPost(jobPost);
      setSubmissionStatus('Job post created/updated successfully!');
      setShowSuccessPopUp(true); // Show the success modal on successful job posting
      console.log(response);
      setJob(response);

      // After the job post is successfully created/updated, reset the form
      dispatch(resetJobPost()); // Reset the form data to its initial state

      // Optionally navigate to the job post page after reset
      navigate(`/recruiter/${recruiter.rUserName}/jobs/${response._id}`);
      
    } catch (error) {
      console.error(error);
      setSubmissionStatus('Error occurred while creating/updating job post. Please try again.');
    }
  };

  const handlePreview = () => {
    if (!validateJobPost()) {
      setError('Please fill out all required fields before previewing.');
      return;
    }
    setError('');
    navigate('preview', { state: jobPost });
  };

  const handleCloseModal = () => {
    setShowSuccessPopUp(false); // Close the modal when "Close" is clicked
    navigate(`/recruiter/${recruiter.rUserName}/jobs/${job._id}`)
  };

  // Fetch job post by jobid if it's present in the URL params
  const fetchJobData = async () => {
    if (jobid) {
      try {
        const response = await getJobPostByJobId(jobid);
        if (response) {
          dispatch(setJobPost(response)); // Populate the form with fetched job data
        } else {
          console.error('No job post found with the provided jobid');
        }
      } catch (error) {
        console.error('Error fetching job post:', error);
      }
    }
  };

  // Fetch job post data when component mounts or jobid changes
  useEffect(() => {
    fetchJobData();
  }, [jobid, dispatch]);

  // Ensure that only the correct recruiter can post a job
  useEffect(() => {
    if (recruiterusername && recruiter.rUserName !== recruiterusername) {
      navigate(`/recruiter/${recruiter.rUserName}/post-a-job`);
    }
  }, [recruiterusername, recruiter.rUserName, navigate]);

  return (
    <div className="bg-blue-500 min-h-screen p-4 flex justify-center items-center font-primary">
      <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-lg">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-semibold text-primary">Post a Job</h2>
        </div>

        {error && (
          <div className="rounded w-full text-red-500 border-2 px-4 py-2 border-red-500 bg-red-100 mb-6">
            {error}
          </div>
        )}
        {submissionStatus && (
          <div className="rounded w-full text-green-500 border-2 px-4 py-2 border-green-500 bg-green-100 mb-6">
            {submissionStatus}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Job Details Section */}
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold text-gray-700">Job Details</h3>
            <InputLabelElement
              type="text"
              name="jobPostName"
              value={jobPost.jobPostName}
              onChange={handleChange}
              label="Job Title"
              placeholder="e.g., Software Engineer"
              required
            />
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Job Description</label>
              <EditorElement 
                value={jobPost.jobPostDescription} 
                setValue={(value) => dispatch(setJobPost({ jobPostDescription: value }))} 
              />
            </div>
            <InputLabelElement
              type="text"
              name="jobPostAddress"
              value={jobPost.jobPostAddress}
              onChange={handleChange}
              label="Job Address"
              placeholder="Enter job location"
              required
            />
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Required Skills</label>
              <div className="flex gap-2 items-baseline">
                <InputLabelElement
                  type="text"
                  value={newSkill}
                  onChange={handleSkillsChange}
                  placeholder="e.g., JavaScript, Node.js"
                />
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="px-6 py-2 bg-primary text-white rounded-md hover:bg-blue-600 transition text-nowrap"
                >
                  Add Skill
                </button>
              </div>
              <ul className="mt-2 flex gap-2 flex-wrap">
                {jobPost.jobPostSkill.map((skill, index) => (
                  <li key={index} className="text-sm text-gray-700 list-none">
                    <div className="text-[4vw] xs:text-sm sm:text-[1rem] flex rounded-full px-4 py-1 items-center justify-center w-max  gap-1 bg-green-200 text-green-800">
                      {skill}
                      <button
                        type="button"
                        onClick={() => dispatch(removeSkill(skill))}
                        className="ml-2 text-red-500 bg-white rounded-full w-6 h-6"
                      >
                        &times;
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Job Type & Compensation Section */}
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold text-gray-700">Job Type & Compensation</h3>
            <InputLabelElement
              type="select"
              name="jobPostType"
              value={jobPost.jobPostType}
              onChange={handleChange}
              label="Job Type"
              options={[
                { value: 'fulltime', label: 'Full-time' },
                { value: 'parttime', label: 'Part-time' },
                { value: 'internship', label: 'Internship' },
                { value: 'contract', label: 'Contract' },
              ]}
              required
            />
            <InputLabelElement
              type="number"
              name="jobPostMinSalary"
              value={jobPost.jobPostMinSalary}
              onChange={handleChange}
              label="Minimum Salary"
              placeholder="Enter minimum salary"
            />
            <InputLabelElement
              type="number"
              name="jobPostMaxSalary"
              value={jobPost.jobPostMaxSalary}
              onChange={handleChange}
              label="Maximum Salary"
              placeholder="Enter maximum salary"
            />
          </div>

          {/* Job Mode & Level Section */}
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold text-gray-700">Job Mode & Level</h3>
            <InputLabelElement
              type="select"
              name="jobPostMode"
              value={jobPost.jobPostMode}
              onChange={handleChange}
              label="Job Mode"
              options={[
                { value: 'onsite', label: 'Onsite' },
                { value: 'remote', label: 'Remote' },
                { value: 'hybrid', label: 'Hybrid' },
              ]}
              required
            />
            <InputLabelElement
              type="select"
              name="jobPostLevel"
              value={jobPost.jobPostLevel}
              onChange={handleChange}
              label="Experience Level"
              options={[
                { value: 'entry-level', label: 'Entry-Level' },
                { value: 'mid-level', label: 'Mid-Level' },
                { value: 'senior-level', label: 'Senior-Level' },
              ]}
              required
            />
            <InputLabelElement
              type="select"
              name="jobPostQualification"
              value={jobPost.jobPostQualification}
              onChange={handleChange}
              label="Qualification"
              options={[
                { value: 'none', label: 'No Qualification' },
                { value: 'bachelor', label: "Bachelor's Degree" },
                { value: 'master', label: "Master's Degree" },
                { value: 'phd', label: 'PhD' },
              ]}
              required
            />
            <InputLabelElement
              type="number"
              name="jobPostVacancies"
              value={jobPost.jobPostVacancies}
              onChange={handleChange}
              label="Vacancies"
              placeholder="Enter number of vacancies"
            />
          </div>

          {/* Confirmation Checkbox */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="confirmation"
              checked={isConfirmed}
              onChange={(e) => setIsConfirmed(e.target.checked)}
              className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
            />
            <label htmlFor="confirmation" className="ml-2 text-sm text-gray-600">
              I confirm that all information is correct and I wish to post this job.
            </label>
          </div>

          <div className="space-y-2">
            <button
              type="submit"
              className="w-full px-6 py-3 bg-primary text-white rounded-md hover:bg-blue-600 transition"
            >
              {jobid?"Update Job Post":"Post A Job"}
            </button>
            <button
              type="button"
              onClick={handlePreview}
              className="w-full px-6 py-3 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
            >
              Preview
            </button>
          </div>
        </form>
      </div>

      {/* Success Modal */}
      {showSuccessPopUp && (
        <SuccessPopUp
          message="Your job has been posted successfully!"
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}

export default PostAJob;
