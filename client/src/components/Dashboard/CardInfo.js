import React from "react";

const CardInfo = ({ label, value, icon }) => {
  return (
    <div className="flex items-center gap-2 my-2 whitespace-pre text-start text-secondary">
      <div className="flex items-center gap-2">
        <span className={`${icon} text-purple text-lg`}></span>
        <p className={icon ? "font-medium " : "font-medium ml-[19px]"}>
          {label}
        </p>
      </div>

      <p className="overflow-hidden text-slate-700 text-ellipsis" title={value}>
        {value}
      </p>
    </div>
  );
};

export default CardInfo;
