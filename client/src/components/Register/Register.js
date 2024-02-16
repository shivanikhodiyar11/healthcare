import { Link, Navigate } from "react-router-dom";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
import { useState } from "react";
import FormField from "./FormField";
import { useAuth } from "../../hooks/useAuth";
import { useForm } from "react-hook-form";
import axios from "axios";
import Loading from "../Loading";
import PrimaryHeading from "../PrimaryHeading";
const registerSchema = Joi.object({
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
  role: Joi.string()
    .valid("Doctor", "Pharmacist", "Nurse", "Admin")
    .required()
    .messages({
      "any.only": "Role is required",
    }),
});

const Register = () => {
  const { auth } = useAuth();
  const [state, setState] = useState("idle");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: joiResolver(registerSchema),
    mode: "all",
  });

  if (auth?.isAuthenticated) return <Navigate to="/" />;

  const onSubmit = async (data) => {
    try {
      setState("submitting");
      const res = await axios.post(
        `${process.env.REACT_APP_PATH_NAME}/user/register`,
        data
      );
      if (res.status === 200) {
        reset();
        setState("success");
      }
    } catch (error) {
      console.error(error);
      alert(error.response.data);
      setState("error");
    }
  };

  return (
    <div>
      <div className="container flex flex-col p-5 my-5 bg-white shadow-xl">
        <div className="flex justify-center">
          {state === "success" ? (
            <div className="flex items-center justify-center gap-2 p-2 text-2xl font-medium text-success">
              <span className="fa-solid fa-circle-check "></span>
              <div>Registered Successfully! Check Your Email to Verify</div>
            </div>
          ) : (
            <div className="flex flex-col gap-3 mb-5 text-center ">
              <PrimaryHeading name="Register Now" />
              <p className="text-xl text-mute">
                Please Fill Out Below Details To Get Started
              </p>
            </div>
          )}
        </div>
        {state === "error" && (
          <div className="flex items-center justify-center gap-2 text-xl text-red-600">
            <span className="fa-solid fa-circle-xmark"></span>
            <h1>Please enter valid email.</h1>
          </div>
        )}
        <div className="flex justify-center gap-16">
          <div className="w-7/12 p-10 ml-16">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-3">
                <div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="role" className="text-primary">
                      Choose Account Type:
                    </label>
                    <select
                      id="role"
                      className="border w-96 p-2.5 bg-white"
                      defaultValue={"DEFAULT"}
                      {...register("role")}
                    >
                      <option value="DEFAULT" disabled>
                        Select Role
                      </option>
                      <option value="Doctor">Doctor</option>
                      <option value="Nurse">Nurse</option>
                      <option value="Pharmacist">Pharmacist</option>
                    </select>
                  </div>
                  {errors.role && (
                    <span className="flex items-center gap-2 m-1 text-red-600">
                      <span className="fa-solid fa-circle-exclamation"></span>
                      {errors.role.message}
                    </span>
                  )}
                </div>
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
                  <div className="relative flex gap-5 p-4 mt-2 border w-96">
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
                    {state === "submitting" ? (
                      <Loading size={"text-lg"} name="Loading..." />
                    ) : (
                      <div>SIGNUP</div>
                    )}
                  </button>
                </div>
                <div className="flex gap-1 font-medium text-black">
                  <h1>Already Registered?</h1>
                  <Link to="/login">
                    <p className="text-blue-600 text-md">Login</p>
                  </Link>
                  <p>Now</p>
                </div>
              </div>
            </form>
          </div>
          <div className="flex justify-start w-5/12 my-16 duration-700 -scale-x-100">
            <img
              src="images/sign-up.png"
              alt="signup.webp"
              className="w-auto transition duration-200 h-96 hover:scale-110"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
