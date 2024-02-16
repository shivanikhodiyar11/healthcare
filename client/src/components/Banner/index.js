import React from "react";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import Slider from "react-slick";
import Banner1 from "./Banner1";
import Banner2 from "./Banner2";

export default function Banner() {
  const renderSlides = () =>
    [<Banner1 />, <Banner2 />].map((component) => <div>{component}</div>);

  return (
    <div className="my-5">
      <Slider dots={true} autoplay={true} autoplaySpeed={3000}>
        {renderSlides()}
      </Slider>
    </div>
  );
}
