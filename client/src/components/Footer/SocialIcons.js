import React from "react";
import SocialIconItem from "./SocialIconItem";

const SocialIcons = () => {
  return (
    <div className="flex gap-5 text-2xl">
      <SocialIconItem icon={"fa-brands fa-instagram"} link={"/"} />
      <SocialIconItem icon={"fa-brands fa-facebook"} link={"/"} />
      <SocialIconItem icon={"fa-brands fa-twitter"} link={"/"} />
      <SocialIconItem icon={"fa-brands fa-linkedin"} link={"/"} />
    </div>
  );
};

export default SocialIcons;
