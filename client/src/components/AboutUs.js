import React from "react";
import PrimaryButton from "./Header/PrimaryButton";
import PrimaryHeading from "./PrimaryHeading";

const AboutUs = () => {
  return (
    <div className="container flex justify-between gap-16 my-16">
      <div className="flex flex-col justify-center w-3/5 gap-10 p-16 shadow-xl">
        <PrimaryHeading name="About US" />
        <p className="text-xl text-mute">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat
          laboriosam, ipsum enim accusamus repudiandae porro nihil numquam vitae
          dolor consequuntur aliquid minima explicabo eaque aperiam pariatur
          incidunt eligendi perferendis quas ab iste repellat quae minus
          provident temporibus. Impedit, adipisci esse itaque, error quaerat,
          tenetur deleniti dolores eos ex nostrum corporis!
        </p>
        <PrimaryButton name="Learn More" />
      </div>
      <div className="w-2/5">
        <img src="images/about-us.png" alt="about-us.png" />
      </div>
    </div>
  );
};

export default AboutUs;
