import React, { useEffect, useState, useRef } from "react";
import { Loader, Button, EditorElement } from "../../";
import { useDispatch, useSelector } from "react-redux";
import { updateCompanyOverview } from "../../../app/Reducers/recruiter.slice";
import { updateRecruiterOverview } from "../../../utils/recruiter.utils";
import { updateAboutUserData } from "../../../utils/user.utils";
import { updateAbout } from "../../../app/Reducers/user.slice";

function AboutSection({ isEditable = false, servedTo = "user", value="Overview Not Uploaded" }) {  
  const recruiter_id = useSelector(state=>state.recruiter.recruiterData._id)  
  const [EditOverview, setEditOverview] = useState(false);
  const [Loading, setLoading] = useState(false);
  const [isTextTruncated, setIsTextTruncated] = useState(true); // Default to truncated
  const [IsUploading, setIsUploading] = useState(false);
  const [isTextTruncable, setIsTextTruncable] = useState(false);
  const ref = useRef(null);
  const overview = value
  const [editingOverview, setEditingOverview] = useState(value)
  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  const handleSubmit = async function () {
    setIsUploading(true)
    console.log(editingOverview);
    
    await delay(1000)
    const response = servedTo=="user"?await updateAboutUserData(editingOverview):await updateRecruiterOverview(recruiter_id,editingOverview)
    if(!response){
      setIsUploading(false)
      return 0
    }
    servedTo=="user"?dispatch(updateAbout(editingOverview)):dispatch(updateCompanyOverview(editingOverview))
    setEditOverview(false)
    setIsUploading(false)
  };
  const dispatch = useDispatch();
  useEffect(() => {
    if (ref.current) {
      // Determine if text is truncable based on scrollHeight and clientHeight
      setIsTextTruncable(ref.current.scrollHeight !== ref.current.clientHeight);
    }
  }, [isTextTruncable, Loading, EditOverview]);

  return Loading ? (
    <Loader />
  ) : (
    <>
      <section className="w-full max-w-screen-lg container mx-auto py-6 pl-6 pr-4 font-primary flex flex-col gap-4">
        <div className="flex justify-between items-center flex-wrap gap-2">
          <h1 className="text-xl xs:text-2xl sm:text-3xl font-bold text-primary">
            {servedTo=="user"?"About":"Overview"}
          </h1>
          {isEditable && (
            <Button
              className="text-[4vw] xs:text-sm sm:text-[1rem] h-max bg-blue-200 text-blue-800 px-2 py-1 flex gap-1 items-center justify-between rounded-md hover:bg-darkSection hover:text-white transition-all duration-300"
              onClick={() => setEditOverview((prev) => !prev)}
            >
              <i className="fa-solid fa-pen-to-square"></i>
              Edit
            </Button>
          )}
        </div>
        <div
          ref={ref}
          dangerouslySetInnerHTML={{ __html: overview}}
          className={`text-justify prose ${isTextTruncated ? "line-clamp-[8]" : ""}`}
        >
          
        </div>
        {isTextTruncable && (
          <Button
            className="ml-auto w-max px-6 py-2 bg-accent text-white rounded-lg transition duration-200 hover:bg-primary"
            onClick={() => setIsTextTruncated((prev) => !prev)}
          >
            {isTextTruncated ? "Show More" : "Show Less"}
          </Button>
        )}
      </section>
      <div
        className={`${
          EditOverview ? "" : "hidden"
        } fixed w-full max-w-[1024px] rounded left-[50%] translate-x-[-50%] top-[50%] translate-y-[-50%] h-max p-4 bg-darkBackground  `}
      >

        <div className="flex justify-between  items-start">
          <div className="font-semibold text-white pb-4">
            {servedTo=="user"?"Edit About Section":"Update Company Overview"}
          </div>
          <div
            className="w-8 h-8 aspect-square hover:bg-sectionBackground text-white hover:text-darkSection flex items-center justify-center rounded-full "
            onClick={() => setEditOverview(false)}
          >
            <i className="fa-solid fa-close"></i>
          </div>
        </div>

        <EditorElement darkMode={true} value={editingOverview} setValue={(value)=>{setEditingOverview(value)}} />

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
            "Upload"
          )}
        </Button>
      </div>
    </>
  );
}

export default AboutSection;
