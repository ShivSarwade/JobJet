import React, { useState } from "react";
import { Loader, Button, InputLabelElement } from "../../";
import { useDispatch } from "react-redux";
import { updateExperience, deleteExperience } from "../../../utils/user.utils";

function ExperienceSection({ isEditable = false, userExperience = {} }) {
  const [Loading, setLoading] = useState(false);
  const [Experience, setExperience] = useState([]);
  const [EditExperience, setEditExperience] = useState(false);
  const [IsUploading, setIsUploading] = useState(false);
  const [newExperience, setNewExperience] = useState({
    companyName: "",
    role: "",
    from: "",
    to: "",
    description: "",
    present: true, // Default is true, indicating this is the present job
  });
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const [UserExperience, setUserExperience] = useState(userExperience);
  const handleDeleteExperience = async (experienceId) => {
    setError(""); // Clear any existing errors

    const response = await deleteExperience(experienceId);

    if (response.error) {
      setError(response.error); // Show error if deletion fails
    } else {
      // Filter out the deleted experience from the local state
      setUserExperience(
        UserExperience.filter((exp) => exp._id !== experienceId)
      );
    }
  };
  const handleEditExperience = (experience) => {
    setEditExperience(true);

    setNewExperience({
      _id: experience._id,
      companyName: experience.companyName,
      role: experience.role,
      description: experience.description,
      from: new Date(experience.from).toISOString().slice(0, 7), // Convert to YYYY-MM
      to: experience.present
        ? ""
        : new Date(experience.to).toISOString().slice(0, 7), // Convert to YYYY-MM
      present: experience.present,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    setError(""); // Clear previous errors
    setIsUploading(true); // Indicate that submission is in progress

    try {
      // Call the `updateExperience` function and pass the newExperience data
      const response = await updateExperience(newExperience);

      if (response.error) {
        // If the API returns an error, set the error state
        setError(response.error);
      } else {
        // If successful, update the UserExperience state with the new experience data
        console.log(response);

        setUserExperience(response);
        setEditExperience(false); // Close the form
        setNewExperience({
          companyName: "",
          role: "",
          from: "",
          to: "",
          description: "",
          present: true, // Reset the form to default values
        });
      }
    } catch (error) {
      // Handle unexpected errors
      setError("An unexpected error occurred. Please try again.");
      console.error("Error during experience update:", error);
    } finally {
      setIsUploading(false); // Stop the loading indicator
    }
  };

  // Update experience data based on form inputs
  const handleExperienceChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      // Handle checkbox specifically (for the "present" field)
      setNewExperience({
        ...newExperience,
        [name]: checked, // Set the value to 'true' or 'false' based on checkbox state
      });
    } else {
      // Handle text and other types of inputs (e.g., 'month', 'text', etc.)
      setNewExperience({
        ...newExperience,
        [name]: value, // Update field with new value
      });
    }
  };

  return Loading ? (
    <Loader />
  ) : (
    <>
      <section className="w-full max-w-screen-lg container mx-auto py-6 pl-6 pr-4 font-primary flex flex-col gap-4">
        <div className="flex justify-between items-center flex-wrap gap-2">
          <h1 className="text-xl xs:text-2xl sm:text-3xl font-bold text-primary pb-2">
            Experience
          </h1>
          {isEditable && (
            <div className="flex gap-2">
              <Button
                className="text-[4vw] xs:text-sm sm:text-[1rem] h-max bg-blue-200 text-blue-800 px-2 py-1 flex gap-1 items-center justify-between rounded-md hover:bg-darkSection hover:text-white transition-all duration-300"
                onClick={() => {
                  setEditExperience((prev) => !prev);
                  setNewExperience({
                    companyName: "",
                    role: "",
                    from: "",
                    to: "",
                    description: "",
                    present: true, // Reset the form to default values
                  });
                }}
              >
                <i className="fa-solid fa-plus"></i>
                <span className=" [@media(max-width:349px)]:hidden">
                  {" "}
                  Add Experience
                </span>
              </Button>
            </div>
          )}
        </div>
        <div className="w-full h-full flex flex-wrap gap-4 ">
          {UserExperience.length > 0 &&
          !(UserExperience.length === 1 && UserExperience[0] === false)
            ? UserExperience.map((elem, index) => (
                <div
                  className="px-2 flex flex-col gap-1 w-full border-b border-gray-200 rounded-sm capitalize "
                  key={elem._id}
                >
                  <div className="flex justify-between">
                    <h1 className="text-xl text-accent font-bold">
                      {elem.role}
                    </h1>
                    <div className="flex gap-2">
                      <Button
                        className="text-[4vw] xs:text-sm sm:text-[1rem] h-max bg-blue-200 text-blue-600  px-2 py-1 flex gap-1 items-center justify-between rounded-md hover:bg-blue-600 hover:text-white transition-all duration-300"
                        onClick={() => {
                          handleEditExperience(elem)
                        }}
                      >
                        <i className="fa-solid fa-pen"></i>
                      </Button>
                      <Button
                        className="text-[4vw] xs:text-sm sm:text-[1rem] h-max bg-red-600 text-white  px-2 py-1 flex gap-1 items-center justify-between rounded-md hover:bg-red-200 hover:text-red-600 transition-all duration-300"
                        onClick={() => {
                          handleDeleteExperience(elem._id);
                        }}
                      >
                        <i className="fa-solid fa-trash-can"></i>
                      </Button>
                    </div>
                  </div>
                  <h2 className="text-sm">{elem.companyName}</h2>
                  <h2 className="text-xs text-gray-400">
                    {new Date(elem.from).toLocaleString("default", {
                      year: "numeric",
                      month: "long",
                    })}
                    ~
                    {elem.present
                      ? "Present"
                      : new Date(elem.to).toLocaleString("default", {
                          year: "numeric",
                          month: "long",
                        })}
                  </h2>
                  <p className="text-xs pt-3">{elem.description}</p>
                </div>
              ))
            : "No Experience added by user"}
        </div>
      </section>

      {/* Form for adding/editing experience */}
      <form
        className={`${
          EditExperience ? "" : "hidden"
        } fixed w-full max-w-[1024px] rounded left-[50%] translate-x-[-50%] top-[50%] translate-y-[-50%] h-max p-4 bg-darkBackground`}
      >
        <div className="flex justify-between items-start">
          <div className="font-semibold text-white pb-4">
            Add New Experience
          </div>
          <div
            className="w-8 h-8 aspect-square hover:bg-sectionBackground text-white hover:text-darkSection flex items-center justify-center rounded-full "
            onClick={() => setEditExperience(false)}
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
            value={newExperience.companyName}
            onChange={handleExperienceChange}
            placeholder="Enter company name"
            mode="dark"
            label="Company Name"
            name="companyName"
            required
          />
          <InputLabelElement
            type="text"
            value={newExperience.role}
            onChange={handleExperienceChange}
            placeholder="Enter role name"
            mode="dark"
            label="Role"
            name="role"
            required
          />
          <InputLabelElement
            type="textarea"
            value={newExperience.description}
            onChange={handleExperienceChange}
            placeholder="Enter Description name"
            mode="dark"
            label="Description"
            name="description"
            required
          />

          <InputLabelElement
            type="month"
            value={newExperience.from}
            onChange={handleExperienceChange}
            mode="dark"
            label="From"
            name="from"
            required
          />
          <InputLabelElement
            type="checkbox"
            checked={newExperience.present} // Ensure checkbox reflects the current state
            onChange={handleExperienceChange} // Toggles the checkbox value on change
            mode="dark"
            label="Is this your present job"
            name="present" // This will map to newExperience.present
            flex
          />
          {/* Conditionally render the "To" field based on whether the job is current or not */}
          {!newExperience.present && (
            <InputLabelElement
              type="month"
              value={newExperience.to}
              onChange={handleExperienceChange}
              mode="dark"
              label="To"
              name="to"
              required={!newExperience.present} // Required only if not a present job
              disabled={newExperience.present} // Disabled if the job is present
            />
          )}
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
            "Add Experience"
          )}
        </Button>
      </form>
    </>
  );
}

export default ExperienceSection;
