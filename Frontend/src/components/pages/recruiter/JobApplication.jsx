import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import JSZip from "jszip"; // Import JSZip
import { getJobApplications } from "../../../utils/jobPost.util"; // Import the utility function
import avatar from "../../../assets/male avatar.svg";

// Utility function to download individual files (Cloudinary URL)
const downloadFile = (cloudinaryPdfUrl) => {
  console.log("Original Cloudinary URL:", cloudinaryPdfUrl);

  // Ensure the URL uses HTTPS
  if (!cloudinaryPdfUrl.startsWith("https://")) {
    cloudinaryPdfUrl = cloudinaryPdfUrl.replace("http://", "https://");
  }

  // Check if the URL contains a version number like 'v1732510099'
  const versionPattern = /\/v\d+/;
  let downloadUrl = cloudinaryPdfUrl;

  if (versionPattern.test(cloudinaryPdfUrl)) {
    // Replace the version number with 'fl_attachment'
    downloadUrl = cloudinaryPdfUrl.replace(versionPattern, "/fl_attachment");
    console.log(
      "Download URL after replacing version with fl_attachment:",
      downloadUrl
    );
  } else if (cloudinaryPdfUrl.includes("/upload/")) {
    // If the URL contains '/upload/', add 'fl_attachment' after it
    downloadUrl = cloudinaryPdfUrl.replace(
      "/upload/",
      "/upload/fl_attachment/"
    );
  }

  // Ensure the URL is still using HTTPS
  if (!downloadUrl.startsWith("https://")) {
    downloadUrl = downloadUrl.replace("http://", "https://");
  }

  // Extract the filename from the URL (after the last '/')
  const filename = `resume.pdf`; // Modify the filename format if needed

  // Create a temporary link and simulate the download
  const link = document.createElement("a");
  link.href = downloadUrl;

  // Set the download attribute to the extracted filename
  link.download = filename;

  // Simulate the download by clicking the link
  link.click();
};

// Utility function to download all resumes as a ZIP file
const downloadAllResumes = async (applications) => {
  const zip = new JSZip();
  const folder = zip.folder("resumes");

  // Create an array of promises to fetch all resume URLs
  const fetchPromises = applications.map((app) => {
    const resumeUrl = app.resume; // Assuming the resume URL is stored in 'resume'
    if (resumeUrl) {
      return fetch(resumeUrl)
        .then((response) => response.blob())
        .then((blob) => {
          const filename = `${app.user.firstName}-${app.user.lastName}.pdf`; // Name of the file in the ZIP
          folder.file(filename, blob); // Add the file to the ZIP folder
        })
        .catch((error) => console.error("Error fetching resume:", error));
    }
  });

  // Wait for all fetch requests to complete
  await Promise.all(fetchPromises);

  // Generate the ZIP file and trigger the download
  zip.generateAsync({ type: "blob" }).then((content) => {
    const link = document.createElement("a");
    link.href = URL.createObjectURL(content);
    link.download = "resumes.zip"; // Download the ZIP file
    link.click();
  });
};

const JobApplication = ({ presentingTo = "recruiter" }) => {
  const { jobid, recruiterusername } = useParams(); // Get jobId from URL parameters
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [jobPost, setJobPost] = useState({});

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const result = await getJobApplications(
          jobid,
          recruiterusername,
          presentingTo
        );
        console.log(result);
        if (result.applications) {
          setApplications(result.applications);
          setJobPost(result.job);
        } else {
          setError(result.message);
        }
      } catch (err) {
        setError(err.message || "Failed to fetch applications");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [jobid, recruiterusername]);

  if (loading)
    return <p className="text-center text-lg">Loading applications...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex items-center justify-between py-4 flex-wrap ">
        <h1 className="text-2xl font-bold text-center mb-6 text-primary">
          Job Applications for Role of {jobPost.jobPostName}
        </h1>

        {/* New Heading for Application Count */}

        <div className="text-right justify-self-center">
          {presentingTo === "recruiter" && (
            <button
              onClick={() => downloadAllResumes(applications)} // Trigger the downloadAllResumes function
              className="bg-indigo-300  text-indigo-800 flex gap-2 items-center font-semibold px-4 py-2 rounded-md hover:bg-indigo-400"
            >
              <i className="fa-solid fa-download"></i>
              <span className="hidden sm:block">Download All</span>
            </button>
          )}
        </div>
      </div>
      <h2 className="text-xl font-bold text-start text-accent py-4">
        Total Applications: {applications.length}
      </h2>

      {applications.length === 0 ? (
        <p className="text-center text-gray-600">No applications found.</p>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div
              key={app._id}
              className="flex flex-col sm:flex-row gap-4 sm:gap-0 sm:items-center justify-between bg-white p-4 shadow-md rounded-lg "
            >
              {/* Logo */}
              <div className="flex items-center ">
                <img
                  src={app.user.avatar || avatar}
                  alt="Logo"
                  className="h-12 w-12 rounded-full mr-4"
                />
                {/* Name */}
                <div>
                  <p className="text-base sm:text-lg text-primary font-bold capitalize">
                    {app.user.firstName + " " + app.user.lastName || "Unknown"}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500 ">
                    {app.user?.email || "No email provided"}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <Link
                  to={
                    presentingTo == "recruiter"
                      ? `/recruiter/${recruiterusername}/user/${app.user.username}`
                      : `/admin/user/${app.user.username}`
                  }
                  className="w-full bg-green-300 text-green-800 flex gap-2 items-center justify-center font-semibold px-4 py-2 rounded-md hover:bg-green-400"
                >
                  <i className="fa-solid fa-eye"></i>
                  <span className="hidden xs:block text-xs sm:text-base">
                    Profile
                  </span>
                </Link>
                {presentingTo === "recruiter" && (
                  <button
                    onClick={() => downloadFile(app.resume)} // Use 'resume' here instead of 'resumePath'
                    className="w-full bg-blue-300 text-blue-800 flex gap-2 items-center justify-center font-semibold px-4 py-2 rounded-md hover:bg-blue-400"
                  >
                    <i className="fa-solid fa-download"></i>
                    <span className="hidden xs:block text-xs sm:text-base">
                      Resume
                    </span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobApplication;
