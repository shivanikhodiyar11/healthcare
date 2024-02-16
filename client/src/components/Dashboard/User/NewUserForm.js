import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
import React from "react";
import { useForm } from "react-hook-form";
import FormField from "../../Register/FormField";

const UserSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .messages({
      "string.email": "Enter valid email address",
      "string.empty": "Email is required",
    }),
  first_name: Joi.string()
    .required()
    .trim()
    .min(3)
    .max(15)
    .messages({ "string.empty": "First Name is required" })
    .label("First Name"),
  last_name: Joi.string()
    .required()
    .trim()
    .min(3)
    .max(15)
    .messages({ "string.empty": "Last Name is required" })
    .label("Last Name"),
  gender: Joi.string().valid("Male", "Female").required().messages({
    "any.only": "Gender is Required",
  }),
  phoneNo: Joi.string()
    .pattern(/^[6-9]{1}\d{9}$/)
    .required()
    .messages({
      "string.pattern.base": "Enter valid contact number",
      "string.empty": "Contact No is required",
    }),
});

const NewUserForm = ({ details, onSubmit }) => {
  const getDefaultValues = () => {
    if (!details) return;
    return {
      email: details.email,
      first_name: details.first_name,
      last_name: details.last_name,
      phoneNo: details.phoneNo,
      gender: details.gender,
    };
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: joiResolver(UserSchema),
    defaultValues: getDefaultValues(),
    mode: "all",
  });

  return (
    <form onSubmit={handleSubmit(onSubmit(reset))}>
      <div className="flex flex-col gap-5 px-10">
        <FormField
          type="text"
          error={errors.email}
          register={register("email")}
          placeholder="you@gmail.com"
          name="email"
          icon="fa-solid fa-envelope"
        />
        <FormField
          type="text"
          error={errors.first_name}
          register={register("first_name")}
          placeholder="First Name"
          name="first_name"
          icon="fa-solid fa-user"
        />
        <FormField
          type="text"
          error={errors.last_name}
          register={register("last_name")}
          placeholder="Last Name"
          name="last_name"
          icon="fa-solid fa-user"
        />
        <FormField
          type="text"
          error={errors.phoneNo}
          register={register("phoneNo")}
          placeholder="Contact No"
          name="phoneNo"
          icon="fa-solid fa-phone"
        />
        <div>
          <div className="relative flex gap-5 p-4 mt-2 border">
            <label
              htmlFor="gender"
              className="absolute text-lg bg-white -top-4 left-3 text-extrabold text-primary"
            >
              Gender:
            </label>
            <div className="flex items-center">
              <input
                id="Male"
                type="radio"
                value="Male"
                name="gender"
                {...register("gender")}
                className="w-4 h-4 accent-primary"
              />
              <label
                htmlFor="Male"
                className="ml-2 font-medium text-gray-600 text-md dark:text-gray-300"
              >
                Male
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="Female"
                type="radio"
                value="Female"
                {...register("gender")}
                name="gender"
                className="w-4 h-4 accent-primary"
              />
              <label
                htmlFor="Female"
                className="ml-2 font-medium text-gray-600 text-md dark:text-gray-300"
              >
                Female
              </label>
            </div>
          </div>
          {errors.gender && (
            <span className="flex items-center gap-2 m-1 text-red-600">
              <span className="fa-solid fa-circle-exclamation"></span>
              {errors.gender.message}
            </span>
          )}
        </div>
        <div className="my-3">
          <button
            type="submit"
            className="px-8 py-2.5 rounded-full bg-primary text-white"
          >
            {details ? "Update" : "Add"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default NewUserForm;
