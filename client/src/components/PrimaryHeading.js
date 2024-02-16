import React from "react";

const PrimaryHeading = ({ name }) => {
  return (
    <p className="text-3xl font-bold underline text-secondary decoration-4 underline-offset-8 decoration-primary">
      {name}
    </p>
  );
};

export default PrimaryHeading;
