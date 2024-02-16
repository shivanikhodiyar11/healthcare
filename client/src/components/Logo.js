import React from "react";
import { Link } from "react-router-dom";
import LogoImage from "../assets/Logo/healthcare_logo.png";

const Logo = () => {
  return (
    <div className="relative flex items-center">
      <div className="w-24 h-auto">
        <Link to="/">
          <img src={LogoImage} alt="healthcare-logo.png" />
        </Link>
      </div>
      <div className="absolute top-2 left-16">
        <h1 className="text-xl font-bold tracking-wider font-charm-style text-secondary">
          Healthcare
        </h1>
      </div>
    </div>
  );
};

export default Logo;
