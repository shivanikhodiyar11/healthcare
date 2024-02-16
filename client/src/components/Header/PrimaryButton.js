import React from "react";
import { Link } from "react-router-dom";
const PrimaryButton = ({ link, name, ...rest }) => {
  return (
    <div>
      <Link to={link}>
        <button
          {...rest}
          className="px-6 py-2 font-medium leading-tight transition duration-300 border-2 rounded whitespace-nowrap text-secondary border-secondary hover:bg-secondary hover:text-white hover:border-primary"
        >
          {name}
        </button>
      </Link>
    </div>
  );
};

export default PrimaryButton;
