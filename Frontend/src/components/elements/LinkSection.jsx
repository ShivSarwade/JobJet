import React, { useState } from "react";
import { useId } from "react";
import { Link } from "react-router-dom";

export default function LinkSection({ value, link = {} }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="flex flex-col justify-start gap-4 transition-all duration-300  *:font-primary max-[900px]:gap-0 max-[900px]:overflow-hidden ">
      <div
        className="font-semibold text-[1.4rem] text-primary flex justify-between items-center pr-4 py-0 max-[900px]:border-b-[2px_black] max-[900px]:pr-4 max-[900px]:pl-2 max-[900px]:border-b-[1px] border-black"
        onClick={(previous) => {
          setExpanded((previous) => !previous);
        }}
      >
        <span>{value}</span>
        <div className="dropdown hidden max-[900px]:block  ">
          <i
            className={`fa-solid fa-circle-chevron-down transition-all duration-200 ${
              expanded ? "rotate-180" : "rotate-0"
            }`}
          ></i>
        </div>
      </div>
      <div
        className={`flex flex-col gap-2 text-[1.1rem] font-medium ${
          expanded ? "max-[900px]:h-full max-[900px]:py-2" : "max-[900px]:h-0"
        } max-[900px]:pl-2`}
      >
        {link.map((navlinks) => (
          <Link to={navlinks.href} key={useId()}>
            {navlinks.text}
          </Link>
        ))}
      </div>
    </div>
  );
}
