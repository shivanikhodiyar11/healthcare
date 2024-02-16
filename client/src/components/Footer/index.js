import React from "react";
import SocialIcons from "./SocialIcons";

const Footer = () => {
  return (
    <div className="flex items-center justify-between w-full p-4 text-lg bg-secondary text-primary">
      <div className="mx-4">
        <p>Copyright © 2022.Healthcare Management. All Rights Reserved</p>
      </div>
      <div className="flex flex-col gap-2 mx-12">
        <div>
          <p>Follow us on:</p>
        </div>
        <div className="flex gap-5 text-2xl">
          <SocialIcons />
        </div>
      </div>
    </div>
  );
};

export default Footer;
