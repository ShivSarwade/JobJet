import React from "react";

function Loader() {
  return (
      <div className="flex-col gap-4 w-full h-full flex items-center justify-center">
        <div className="aspect-square w-[10%] lg:w-[5%] border-4 border-transparent text-blue-400 text-4xl animate-spin flex items-center justify-center  border-t-primary rounded-full">
          <div className="aspect-square w-[80%] border-4 border-transparent text-red-400 text-2xl animate-spin flex items-center justify-center border-t-accent rounded-full"></div>
        </div>
      </div>
  );
}

export default Loader;
