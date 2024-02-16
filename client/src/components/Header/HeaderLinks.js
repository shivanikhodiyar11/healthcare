import React from "react";
import HeaderLinkItem from "./HeaderLinkItem";
import { useAuth } from "../../hooks/useAuth";

const HeaderLinks = () => {
  const { auth } = useAuth();
  return (
    <div className="flex gap-6">
      {auth.isAuthenticated ? (
        <HeaderLinkItem name={"Home"} link={"/dashboard"} />
      ) : (
        <HeaderLinkItem name={"Home"} link={"/"} />
      )}
      <HeaderLinkItem name={"About Us"} link={"/about-us"} />
      <HeaderLinkItem name={"Contact Us"} link={"/contact-us"} />
    </div>
  );
};

export default HeaderLinks;
