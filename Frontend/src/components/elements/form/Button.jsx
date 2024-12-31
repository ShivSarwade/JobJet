import React from 'react'
import { forwardRef } from 'react'
function Button({ className = "", type = "button", onClick, value = "Submit", children }, ref) {
  return (
    <button
      className={className?className:"font-primary text-white cursor-pointer text-base font-semibold bg-accent border-2 border-accent border-solid rounded-md py-2 xs:py-3 px-[2vw] xs:px-6  duration-300 hover:text-accent hover:bg-transparent"}
      type={type}
      ref={ref}
      onClick={onClick}
      value={value}
    >
      {children ? children : value}
    </button>
  )
}

export default forwardRef(Button)

// import React, { forwardRef } from 'react';

// function Button({ className = "", type = "button", onClick, value = "Submit" }, ref) {
//   return (
//     <button
//       className={`p-2 rounded-md ${className}`}
//       type={type}
//       ref={ref}
//       onClick={onClick}
//     >
//       {value}
//     </button>
//   );
// }

// export default forwardRef(Button);
