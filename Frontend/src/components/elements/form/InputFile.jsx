import React from "react";

function InputFile({
    label="Upload File",
    onChange = ()=>{},
    accept= ".png, .jpg, .jpeg ",
    note = "",
    required = false, 
    ...props
}) {
  return (
    <>
      <label
        className=" font-primary block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        htmlFor="file_input"
      >
        {label}
      </label>
      <input
        className=" file:me-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibol file:bg-blue-600 file:text-white hover:file:bg-blue-700 block w-full font-primary text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-sec dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
        aria-describedby="file_input_help"
        id="file_input"
        accept={accept}
        onChange={onChange}
        type="file"
        required={required}
      />
      <p
        className="mt-1 text-sm text-gray-200 dark:text-gray-300"
        id="file_input_help"
      >
        {note}
      </p>
    </>
  );
}

export default InputFile;
