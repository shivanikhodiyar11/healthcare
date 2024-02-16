import React, { useState } from "react";
import Joi from "joi";
import { joiResolver } from "@hookform/resolvers/joi";
import { useForm } from "react-hook-form";
import axios from "axios";
import FormField from "../Register/FormField";
import { useParams, useSearchParams } from "react-router-dom";
import Loading from "../Loading";
import PrimaryHeading from "../PrimaryHeading";

const passwordSchema = Joi.object({
  password: Joi.string()
    .min(8)
    .pattern(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    )
    .trim()
    .messages({
      "string.empty": "Password is required",
      "string.min": "Password should be at least 8 Characters long",
      "string.pattern.base":
        "Password should contain at least 1 capital & special character ",
    }),
  confirmPassword: Joi.any().valid(Joi.ref("password")).required().messages({
    "string.empty": "Password is required",
    "any.only": "Password & Confirm Password does not match",
  }),
});

const CreatePassword = () => {
  const { token } = useParams();
  const [searchParams] = useSearchParams();
  console.log(searchParams.get("route"));

  const [state, setState] = useState("idle");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: joiResolver(passwordSchema),
    mode: "all",
  });

  const onSubmit = async (data) => {
    try {
      setState("submitting");
      const res = await axios.put(
        `${process.env.REACT_APP_PATH_NAME}/user/create-password`,
        { password: data.password },
        { params: { token } }
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
    <div className="container flex flex-col items-center justify-center gap-10 p-10 shadow-xl">
      <div className="flex items-center justify-center gap-16">
        <div className="p-10 transition duration-200 hover:scale-110">
          <img src="/images/create-password.jpg" alt="create-password.jpg" />
        </div>
        <div className="flex flex-col gap-12">
          <div className="flex justify-center">
            {searchParams.get("route") === "reset" ? (
              <PrimaryHeading name="Reset Password" />
            ) : (
              <p className="text-3xl font-bold underline text-secondary decoration-4 underline-offset-8 decoration-primary">
                <PrimaryHeading name="Create Password" />
              </p>
            )}
          </div>
          {state === "success" ? (
            <div className="flex flex-col items-center gap-2 text-xl">
              <div className="flex items-center gap-2 text-success">
                <span className="fa-solid fa-circle-check"></span>
                {searchParams.get("route") === "reset" ? (
                  <h1>Password Reset Successfully!</h1>
                ) : (
                  <h1>Password Created Successfully</h1>
                )}
              </div>
              {searchParams.get("route") !== "reset" && (
                <div className="text-red-500">
                  <h1>Wait For Account approval by Admin for Login</h1>
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-5">
                <FormField
                  type="password"
                  placeholder="Enter Password"
                  error={errors.password}
                  register={register("password")}
                  name="password"
                  icon="fa-solid fa-key"
                />
                <FormField
                  type="password"
                  placeholder="Enter Password"
                  error={errors.confirmPassword}
                  register={register("confirmPassword")}
                  name="confirmPassword"
                  icon="fa-solid fa-lock"
                />

                <div className="flex justify-center">
                  <button
                    type="submit"
                    className="px-8 py-2.5 rounded-full bg-primary text-white"
                  >
                    {state === "submitting" ? (
                      <Loading size={"text-lg"} name="Creating..." />
                    ) : (
                      <div>SUBMIT</div>
                    )}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreatePassword;
