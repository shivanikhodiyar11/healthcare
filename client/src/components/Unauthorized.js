import React from "react";

const Unauthorized = () => {
  return (
    <div className="flex flex-1 mt-5">
      <div className="flex flex-col items-center w-full">
        <div className="flex items-center gap-3 px-4 py-1 text-3xl font-bold text-red-700 bg-slate-300">
          <span className="fa-solid fa-circle-exclamation"></span>
          <h1>You do not have access for this resource.</h1>
        </div>

        <img src="/images/unauthorized.jpg" alt="unauthorized.jpg" />
      </div>
    </div>
  );
};

export default Unauthorized;
