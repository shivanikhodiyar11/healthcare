import React from "react";
import { NavLink } from "react-router-dom";

const APIButton = ({ name, icon, ...rest }) => {
  return (
    <NavLink
      {...rest}
      className={({ isActive }) =>
        isActive
          ? "bg-secondary text-white flex items-center w-full gap-2 p-5 text-xl transition duration-500 rounded"
          : "flex items-center w-full gap-2 p-5 text-xl transition duration-500 rounded hover:bg-secondary hover:text-white bg-slate-100 hover:translate-x-3 text-secondary"
      }
    >
      <span className={icon}></span>
      <h1>{name}</h1>
    </NavLink>
  );
};

export default APIButton;
