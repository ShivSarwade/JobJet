import React ,{useState}from 'react';
import { useId, forwardRef } from 'react';

function InputElement(
  {
    type = 'text',
    value = '',
    name = '',
    onChange,
    placeholder = 'Type here...',
    className=""
  },
  ref
) {
  const id = useId();
  return (
    <div className="w-full max-w-sm min-w-[200px]">
      <input
        id={id}
        type={type}
        name={name}
        onChange={onChange}
        className={className?className:"w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-300 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"}
        placeholder={placeholder}
        value={value}
        ref={ref}
      />
    </div>
  );
}

export default forwardRef(InputElement);
