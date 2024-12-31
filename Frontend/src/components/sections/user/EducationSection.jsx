import React, { useState } from "react";
import { Loader, Button, InputLabelElement } from "../../";
import { useDispatch } from "react-redux";
import { updateEducation, deleteEducation } from "../../../utils/user.utils";

function EducationSection({ isEditable = false, userEducation = [] }) {
  const [Loading, setLoading] = useState(false);
  const [EditEducation, setEditEducation] = useState(false);
  const [IsUploading, setIsUploading] = useState(false);
  const [newEducation, setNewEducation] = useState({
    institutionName: "",
    degree: "",
    from: "",
    to: "",
    description: "",
    grade: "",
  });
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const [UserEducation, setUserEducation] = useState(userEducation);

  const handleDeleteEducation = async (educationId) => {
    setError(""); // Clear any existing errors

    const response = await deleteEducation(educationId);

    if (response.error) {
      setError(response.error); // Show error if deletion fails
    } else {
      // Filter out the deleted education from the local state
      setUserEducation(UserEducation.filter((edu) => edu._id !== educationId));
    }
  };

  const handleEditEducation = (education) => {
    setEditEducation(true);

    setNewEducation({
      _id: education._id,
      institutionName: education.institutionName,
      degree: education.degree,
      description: education.description,
      from: new Date(education.from).toISOString().slice(0, 7), // Convert to YYYY-MM
      to: education.to ? new Date(education.to).toISOString().slice(0, 7) : "", // Convert to YYYY-MM, if exists
      grade: education.grade || "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    setError(""); // Clear previous errors
    setIsUploading(true); // Indicate that submission is in progress

    try {
      // Call the `updateEducation` function and pass the newEducation data
      const response = await updateEducation(newEducation);

      if (response.error) {
        // If the API returns an error, set the error state
        setError(response.error);
      } else {
        // If successful, update the UserEducation state with the new education data
        setUserEducation(response);
        setEditEducation(false); // Close the form
        setNewEducation({
          institutionName: "",
          degree: "",
          from: "",
          to: "",
          description: "",
          grade: "",
        });
      }
    } catch (error) {
      // Handle unexpected errors
      setError("An unexpected error occurred. Please try again.");
      console.error("Error during education update:", error);
    } finally {
      setIsUploading(false); // Stop the loading indicator
    }
  };

  // Update education data based on form inputs
  const handleEducationChange = (e) => {
    const { name, value } = e.target;
    setNewEducation({
      ...newEducation,
      [name]: value, // Update field with new value
    });
  };

  return Loading ? (
    <Loader />
  ) : (
    <>
      <section className="w-full max-w-screen-lg container mx-auto py-6 pl-6 pr-4 font-primary flex flex-col gap-4">
        <div className="flex justify-between items-center flex-wrap gap-2">
          <h1 className="text-xl xs:text-2xl sm:text-3xl font-bold text-primary pb-2">
            Education
          </h1>
          {isEditable && (
            <div className="flex gap-2">
              <Button
                className="text-[4vw] xs:text-sm sm:text-[1rem] h-max bg-blue-200 text-blue-800 px-2 py-1 flex gap-1 items-center justify-between rounded-md hover:bg-darkSection hover:text-white transition-all duration-300"
                onClick={() => {
                  setEditEducation((prev) => !prev);
                  setNewEducation({
                    institutionName: "",
                    degree: "",
                    from: "",
                    to: "",
                    description: "",
                    grade: "",
                  });
                }}
              >
                <i className="fa-solid fa-plus"></i>
                <span className=" [@media(max-width:349px)]:hidden">
                  {" "}
                  Add Education
                </span>
              </Button>
            </div>
          )}
        </div>
        <div className="w-full h-full flex flex-wrap gap-4 ">
          {UserEducation.length > 0 &&
          !(UserEducation.length === 1 && UserEducation[0] === false)
            ? UserEducation.map((elem, index) => (
                <div
                  className="px-2 flex flex-col gap-1 w-full border-b border-gray-200 rounded-sm capitalize "
                  key={elem._id}
                >
                  <div className="flex justify-between">
                    <h1 className="text-xl text-accent font-bold">
                      {elem.degree}
                    </h1>
                    {
                      isEditable?<div className="flex gap-2">
                      <Button
                        className="text-[4vw] xs:text-sm sm:text-[1rem] h-max bg-blue-200 text-blue-600 px-2 py-1 flex gap-1 items-center justify-between rounded-md hover:bg-blue-600 hover:text-white transition-all duration-300"
                        onClick={() => handleEditEducation(elem)}
                      >
                        <i className="fa-solid fa-pen"></i>
                      </Button>
                      <Button
                        className="text-[4vw] xs:text-sm sm:text-[1rem] h-max bg-red-600 text-white  px-2 py-1 flex gap-1 items-center justify-between rounded-md hover:bg-red-200 hover:text-red-600 transition-all duration-300"
                        onClick={() => handleDeleteEducation(elem._id)}
                      >
                        <i className="fa-solid fa-trash-can"></i>
                      </Button>
                    </div>:""
                    }
                  </div>
                  <h2 className="text-sm">{elem.institutionName}</h2>
                  <h2 className="text-xs text-gray-400">
                    {new Date(elem.from).toLocaleString("default", {
                      year: "numeric",
                      month: "long",
                    })}
                    ~
                    {elem.to
                      ? new Date(elem.to).toLocaleString("default", {
                          year: "numeric",
                          month: "long",
                        })
                      : "Present"}
                  </h2>
                  {elem.grade ? (
                    <h2 className="text-xs ">Grade:{elem.grade}</h2>
                  ) : (
                    ""
                  )}
                  <p className="text-xs pt-3">{elem.description}</p>
                </div>
              ))
            : "No Education added by user"}
        </div>
      </section>

      {/* Form for adding/editing education */}
      <form
        className={`${
          EditEducation ? "" : "hidden"
        } fixed w-full max-w-[1024px] rounded left-[50%] translate-x-[-50%] top-[50%] translate-y-[-50%] h-max p-4 bg-darkBackground`}
      >
        <div className="flex justify-between items-start">
          <div className="font-semibold text-white pb-4">Add New Education</div>
          <div
            className="w-8 h-8 aspect-square hover:bg-sectionBackground text-white hover:text-darkSection flex items-center justify-center rounded-full "
            onClick={() => setEditEducation(false)}
          >
            <i className="fa-solid fa-close"></i>
          </div>
        </div>

        <div
          className={`rounded w-full text-red-500 border-2 px-2 py-1 border-red-500 ${
            error ? "block" : "hidden"
          }`}
        >
          {error}
        </div>

        <div className="flex flex-col gap-2">
          <InputLabelElement
            type="text"
            value={newEducation.institutionName}
            onChange={handleEducationChange}
            placeholder="Enter institution name"
            mode="dark"
            label="Institution Name"
            name="institutionName"
            required
          />
          <InputLabelElement
            type="text"
            value={newEducation.degree}
            onChange={handleEducationChange}
            placeholder="Enter degree"
            mode="dark"
            label="Degree"
            name="degree"
            required
          />
          <InputLabelElement
            type="textarea"
            value={newEducation.description}
            onChange={handleEducationChange}
            placeholder="Enter Description"
            mode="dark"
            label="Description"
            name="description"
            required
          />
          <InputLabelElement
            type="month"
            value={newEducation.from}
            onChange={handleEducationChange}
            mode="dark"
            label="From"
            name="from"
            required
          />
          <InputLabelElement
            type="month"
            value={newEducation.to}
            onChange={handleEducationChange}
            mode="dark"
            label="To"
            name="to"
            required
          />
          <InputLabelElement
            type="text"
            value={newEducation.grade}
            onChange={handleEducationChange}
            mode="dark"
            label="Grade"
            name="grade"
          />
        </div>

        <Button
          type="submit"
          onClick={handleSubmit}
          className="my-4 ml-auto py-2 px-5 me-2 mb-2 flex text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
        >
          {IsUploading ? (
            <>
              <svg
                className="mr-3 h-5 w-5 animate-spin text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span className="font-medium"> Processing... </span>
            </>
          ) : (
            "Save Education"
          )}
        </Button>
      </form>
    </>
  );
}

export default EducationSection;
