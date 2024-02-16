import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
import { useState } from "react";
import FormField from "../Register/FormField";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import axios from "axios";
import Loading from "../Loading";
import PrimaryHeading from "../PrimaryHeading";

const resetSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .messages({
      "string.email": "Enter valid email address",
      "string.empty": "Email is required",
    }),
});
const ResetPassword = () => {
  const { token } = useParams();
  const [state, setState] = useState("idle");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: joiResolver(resetSchema),
    mode: "all",
  });

  const onSubmit = async (data) => {
    try {
      setState("submitting");
      const res = await axios.post(
        `${process.env.REACT_APP_PATH_NAME}/user/password-reset`,
        data,
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
    <div>
      <div className="container flex flex-col p-10 mb-10 bg-white shadow-xl">
        <div className="flex justify-center">
          {state === "success" ? (
            <div className="flex items-center justify-center gap-2 p-2 text-2xl font-medium text-success">
              <span className="fa-solid fa-circle-check "></span>
              <div>Check Email for Password Reset</div>
            </div>
          ) : (
            <div className="flex flex-col gap-3 mb-5 text-center ">
              <PrimaryHeading name="Reset Password" />
              <p className="text-xl text-mute">
                Please enter email to reset password.
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
        <div className="flex items-center justify-center gap-12">
          <div className="px-20 py-10">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-3">
                <FormField
                  type="text"
                  error={errors.email}
                  register={register("email")}
                  placeholder="you@gmail.com"
                  name="email"
                  icon="fa-solid fa-envelope"
                />
                <div className="flex justify-center my-3">
                  <button
                    type="submit"
                    className="px-8 py-2.5 rounded-full bg-primary text-white"
                  >
                    {state === "submitting" ? (
                      <Loading size={"text-lg"} name="Resetting..." />
                    ) : (
                      <div>SUBMIT</div>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
          <div className="my-16 duration-700">
            <img
              src="images/reset-password.png"
              alt="signup.webp"
              className="w-auto transition duration-200 h-96 hover:scale-110"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
