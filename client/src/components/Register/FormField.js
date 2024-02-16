import React from "react";

const FormField = ({
  type,
  label,
  name,
  placeholder,
  icon,
  src,
  register,
  error,
  ...rest
}) => {
  return (
    <div>
      <label className="flex justify-start mb-1 text-secondary" htmlFor={name}>
        {label}
      </label>
      <div className="relative">
        <input
          type={type || "text"}
          id={name}
          {...rest}
          name={name}
          className="block px-4 py-3 border shadow-sm pl-11 text-md"
          placeholder={placeholder}
          {...register}
        />
        <div className="absolute inset-y-0 left-0 flex items-center pl-4">
          <span className={`${icon} text-primary`}></span>
          {src && <img src={src} alt="icon" />}
        </div>
      </div>
      {error && (
        <span className="flex items-center gap-2 m-1 text-red-600">
          <span className="fa-solid fa-circle-exclamation"></span>
          {error.message}
        </span>
      )}
    </div>
  );
};

export default FormField;
