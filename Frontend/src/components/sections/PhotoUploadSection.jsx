import React from "react";
import { InputFile, Button } from "../index";
import { forwardRef } from "react";
function PhotoUploadSection(
  {
    isServedToUser = true,
    PreviewAspect,
    error,
    SelectedImage,
    onSubmit,
    EditMode,
    closeEditMode,
    isUploading,
    InputObj = {
      label: "Upload Photo",
      note: "image should be of aspect ratio 1/1",
      accept: ".png, .jpeg, .jpg",
      onChange: () => {},
    },
  },
  ref
) {
  const tempText = "1/1";
  return (
    <div
      className={`z-10 fixed w-full max-w-xl h-max min-h-48 left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] p-2 md:p-4 ${
        EditMode ? "block" : "hidden"
      }`}
    >
      <div className="w-full h-full  bg-darkBackground rounded-lg relative flex items-start justify-center flex-col p-2 gap-1">
        <div
          className="absolute right-2 top-2 aspect-square w-6 flex items-center justify-center rounded-full bg-darkSection text-white hover:bg-slate-200 hover:text-accent transition-all duration-150"
          onClick={closeEditMode}
        >
          <i className="fa-solid fa-close"></i>
        </div>
        <InputFile
          label={InputObj.label}
          note={InputObj.note}
          accept={InputObj.accept}
          onChange={InputObj.onChange}
        />
        <div
          className={`rounded w-full text-red-500 border-2 px-2 py-1 border-red-500 ${
            error ? "block" : "hidden"
          }`}
        >
          {error}
        </div>
        {SelectedImage && (
          <>
            <h3 className=" font-primary block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Preview
            </h3>
            <div
              className={`mx-auto ${
                PreviewAspect != "1/1" ? "aspect-[1450/350]" : "aspect-[1/1]"
              } flex items-center justify-center max-w-full max-h-[60vh] `}
            >
              <img
                src={URL.createObjectURL(SelectedImage)}
                className={`w-full h-full object-cover ${
                  isServedToUser && PreviewAspect == "1/1" ? "rounded-full" : ""
                }`}
              />
            </div>
          </>
        )}
        <Button
          type="button"
          onClick={onSubmit}
          className={`py-2 px-5 me-2 mb-2 flex text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700`}
          disabled={SelectedImage ? "false" : "true"}
        >
          {isUploading ? (
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
    </div>
  );
}

export default forwardRef(PhotoUploadSection);
