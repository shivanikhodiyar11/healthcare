import React from "react";
import { NavLink } from "react-router-dom";
const HeaderLinkItem = ({ link, name }) => {
  return (
    <div>
      <NavLink
        to={link}
        className={({ isActive }) =>
          isActive ? "underline decoration-4 decoration-secondary" : undefined
        }
      >
        <span className="text-2xl font-medium hover:underline decoration-4 text-secondary hover:opacity-70 ">
          {name}
        </span>
      </NavLink>
    </div>
  );
};

export default HeaderLinkItem;
