import React from "react";

const Banner2 = () => {
  return (
    <div className="container flex flex-col items-center">
      <div className="flex gap-16 p-16 my-5">
        <div className="w-1/3">
          <img src="/images/banner-img.png" alt="" />
        </div>
        <div className="flex flex-col items-center justify-center w-2/3 gap-5 p-12">
          <h1 className="font-bold text-7xl text-secondary font-prata-style">
            Best Care & Better Doctor
          </h1>
          <p className="text-mute">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. In
            voluptate temporibus facilis similique aut ullam. Sint aut
            reprehenderit sit officia reiciendis molestiae qui tenetur
            voluptatibus odio ab officiis assumenda aspernatur esse nemo, at
            corrupti exercitationem libero? Ea, autem rem!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Banner2;
