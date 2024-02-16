import React from "react";
import PrimaryButton from "../Header/PrimaryButton";

const Banner1 = () => {
  return (
    <div className="container flex justify-between gap-16 my-16">
      <div className="flex flex-col gap-10 p-20 shadow-xl">
        <h1 className="font-sans text-5xl tracking-wide text-purple">
          "Good Health Saves Money & Bad Health Cost More"
        </h1>
        <p className="text-xl text-mute">
          Hospital Management System is a system enabling hospitals to manage
          information and data related to all aspects of healthcare processes,
          providers, patients, and more, which in turn ensures that processes
          are completed effectively.
        </p>
        <PrimaryButton name="Get Started" link={"/register"} />
      </div>
      <div>
        <img
          src="images/home-bg.png"
          alt="Section-1.bg"
          className="transition duration-500 hover:scale-110"
        />
      </div>
    </div>
  );
};

export default Banner1;
