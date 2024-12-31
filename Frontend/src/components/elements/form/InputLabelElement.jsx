import React, { useId, forwardRef } from "react";

function InputLabelElement(
  {
    type = "text",
    value = "",
    label = "",
    name = "",
    onChange,
    placeholder = "Type here...",
    options = [], // Add options prop for select input
    rows,
    cols,
    mode = "light", // New prop: 'light' or 'dark',
    checked,
    flex=false,
    ...props
  },
  ref
) {
  const id = useId();

  // Define colors based on the mode
  const textColor = mode === "dark" ? "text-white" : "text-slate-700";
  const borderColor = mode === "dark" ? "border-white" : "border-slate-300"; // Default border color
  const focusBorderColor =
    mode === "dark" ? "focus:border-transparent" : "focus:border-accent-500"; // Use accent color on focus
  const placeholderColor =
    mode === "dark"
      ? "placeholder:text-slate-400"
      : "placeholder:text-slate-400";

  return (
    <div className={`${flex?"flex items-center gap-2 ":""} w-full`}>
      <label htmlFor={id} className={`block  text-sm text-wrap ${textColor} ${flex?"":"mb-2"}`}>
        {label}
      </label>
      {type === "textarea" ? (
        <textarea
          id={id}
          name={name}
          onChange={onChange}
          className={`w-full bg-transparent ${placeholderColor} ${textColor} text-sm ${borderColor} border-[1px] rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-2 focus:border-accent-500 hover:border-slate-400 shadow-sm resize-none`}
          placeholder={placeholder}
          value={value}
          rows={rows}
          cols={cols}
          ref={ref}
          {...props}
        />
      ) : type === "select" ? (
        <select
          id={id}
          name={name}
          onChange={onChange}
          value={value}
          className={`w-full bg-transparent ${placeholderColor} ${textColor} text-sm ${borderColor} border-[1px] rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-2 focus:border-accent-500 hover:border-slate-400 shadow-sm`}
          ref={ref}
          {...props}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option, index) => (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : type === "checkbox" ? (
        <input
          id={id}
          type={type}
          name={name}
          onChange={onChange}
          className={` aspect-square h-4  bg-transparent ${placeholderColor} ${textColor} text-sm ${borderColor} border-[1px] rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-2 focus:border-accent-500 hover:border-slate-400 shadow-sm`}
          placeholder={placeholder}
          ref={ref}
          checked={checked}
          {...props}
        />
      ) : (
        <input
          id={id}
          type={type}
          name={name}
          onChange={onChange}
          className={`w-full bg-transparent ${placeholderColor} ${textColor} text-sm ${borderColor} border-[1px] rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-2 focus:border-accent-500 hover:border-slate-400 shadow-sm`}
          placeholder={placeholder}
          value={value}
          ref={ref}
          {...props}
        />
      )}
    </div>
  );
}

export default forwardRef(InputLabelElement);
