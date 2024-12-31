import React, { useState } from "react";
import { Loader, Button, InputLabelElement } from "../../";
import { useDispatch } from "react-redux";
import { updateSkill } from "../../../utils/user.utils";
function SkillsSection({ isEditable = false, userSkills = ["react"] }) {
  const [Loading, setLoading] = useState(false);
  const [Skills, setSkills] = useState([]);
  const [EditSkills, setEditSkills] = useState(false);
  const [IsUploading, setIsUploading] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const [UserSkills, setUserSkills] = useState(userSkills);
  const handleSubmit = async () => {
    const response = await updateSkill(Skills);
    console.log(response)
    if(response.error){
      setError(response.error)
    }
    setUserSkills(response.skills);
    setSkills([]);
    setEditSkills(false);
  };
  const handleSkillsChange = (e) => {
    setNewSkill(e.target.value);
  };

  const handleAddSkill = () => {
    if (typeof newSkill === "string" && newSkill.trim()) {
      if (Skills.includes(newSkill)) {
        setError("You cant enter same skills more than one ");
      } else {
        setError("");
        setSkills([...Skills, newSkill]);
      }
      setNewSkill("");
    } else {
      console.error("Invalid skill:", newSkill);
    }
  };
  return Loading ? (
    <Loader />
  ) : (
    <>
      <section className="w-full max-w-screen-lg container mx-auto py-6 pl-6 pr-4 font-primary flex flex-col gap-4">
        <div className="flex justify-between items-center flex-wrap gap-2">
          <h1 className="text-xl xs:text-2xl sm:text-3xl font-bold text-primary">
            Skills
          </h1>
          {isEditable && (
            <div className="flex gap-2">
              <Button
                className="text-[4vw] xs:text-sm sm:text-[1rem] h-max bg-blue-200 text-blue-800 px-2 py-1 flex gap-1 items-center justify-between rounded-md hover:bg-darkSection hover:text-white transition-all duration-300"
                onClick={() => {
                  setEditSkills((prev) => !prev);
                  setSkills(UserSkills);
                }}
              >
                <i className="fa-solid fa-pen-to-square"></i>
                <span className=" [@media(max-width:349px)]:hidden"> Edit</span>
              </Button>
               
            </div>
          )}
        </div>
        <div className="w-full h-full flex flex-wrap gap-2">
          {UserSkills.length > 0 &&
          !(UserSkills.length === 1 && UserSkills[0] === "")
            ? UserSkills.map((elem, index) => (
                <div
                  className="max-w-full break-words text-[4vw] xs:text-sm sm:text-[1rem] flex rounded-full px-4 py-1 items-center justify-center w-max  capitalize   gap-1 bg-green-200 text-green-800 "
                  key={index}
                >
                  {elem}
                </div>
              ))
            : "No skills added by user"}
        </div>
      </section>
      <div
        className={`${
          EditSkills ? "" : "hidden"
        } fixed w-full max-w-[1024px] rounded left-[50%] translate-x-[-50%] top-[50%] translate-y-[-50%] h-max p-4 bg-darkBackground  `}
      >
        <div className="flex justify-between  items-start">
          <div className="font-semibold text-white pb-4">Add New Skill</div>
          <div
            className="w-8 h-8 aspect-square hover:bg-sectionBackground text-white hover:text-darkSection flex items-center justify-center rounded-full "
            onClick={() => setEditSkills(false)}
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
        <div>
          <div className="flex flex-col xs:flex-row gap-2 items-baseline">
            <InputLabelElement
              type="text"
              value={newSkill}
              onChange={handleSkillsChange}
              placeholder="e.g., JavaScript, Node.js"
              mode="dark"
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
            {Skills.map((skill, index) => (
              <li key={index} className="text-sm text-gray-700 list-none">
                <div className="text-[4vw] xs:text-sm sm:text-[1rem] flex rounded-full px-4 py-1 items-center justify-center w-max  gap-1 bg-green-200 text-green-800 ">
                  {skill}
                  <button
                    type="button"
                    onClick={() =>
                      setSkills(Skills.filter((elem, id) => id !== index))
                    }
                    className="ml-2 text-red-500 bg-white rounded-full w-6 h-6   "
                  >
                    &times;
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <Button
          type="button"
          onClick={handleSubmit}
          className={`my-4 ml-auto py-2 px-5 me-2 mb-2 flex text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700`}
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
            "Add all Skills"
          )}
        </Button>
      </div>
    </>
  );
}

export default SkillsSection;
