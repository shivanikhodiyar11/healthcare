import React from "react";

const InvalidToken = () => {
  return (
    <div className="flex items-center justify-center gap-2 text-5xl text-yellow-500 h-96">
      <span className="fa-solid fa-triangle-exclamation"></span>
      <h1>This Link does not exist's anymore</h1>
    </div>
  );
};

export default InvalidToken;
