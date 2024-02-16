import React from "react";

const Loading = ({ size, name }) => {
  return (
    <div
      className={`${size} font-medium text-secondary animate-pulse`}
      role="status"
    >
      {name}
    </div>
  );
};

export default Loading;
