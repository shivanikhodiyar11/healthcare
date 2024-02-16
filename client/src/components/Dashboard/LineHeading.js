import React from "react";

const LineHeading = ({ name }) => {
  return (
    <div className="relative my-4">
      <hr />
      <h1 className="absolute px-3 text-2xl font-bold -translate-x-1/2 bg-white left-1/2 -top-4 text-purple">
        {name}
      </h1>
    </div>
  );
};

export default LineHeading;
