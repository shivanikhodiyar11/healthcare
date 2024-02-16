import { Link, Navigate } from "react-router-dom";
import FormField from "../Register/FormField";
import Joi from "joi";
import { joiResolver } from "@hookform/resolvers/joi";
import { useForm } from "react-hook-form";
import { useAuth } from "../../hooks/useAuth";
import axios from "axios";
import Loading from "../Loading";
import { useState } from "react";
import PrimaryHeading from "../PrimaryHeading";

const loginSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .messages({
      "string.email": "Enter valid email address",
      "string.empty": "Email is required",
    }),
  password: Joi.string().required().messages({
    "string.empty": "Password is required",
  }),
});

const Login = () => {
  const { auth, dispatch } = useAuth();
  const [state, setState] = useState("idle");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    // setError,
  } = useForm({
    mode: "all",
    resolver: joiResolver(loginSchema),
  });
  if (auth?.isAuthenticated) return <Navigate to="/dashboard" />;

  const onSubmit = async (data) => {
    try {
      setState("submitting");
      const res = await axios.post(
        `${process.env.REACT_APP_PATH_NAME}/user/login`,
        data
      );
      if (res.status === 200) {
        setState("success");
        dispatch({ type: "loggedIn", payload: res.data });
      }
    } catch (error) {
      const res = error.response;
      // Handle Errors
      if (res.status === 401) {
        alert("Invalid Username or Password");
        setState("error");
        reset();
      } else if (res.status === 403) {
        reset();
        setState("error");
        alert(res.data);
      } else if (res.status === 500) {
        reset();
        setState("error");
        alert("Please complete your registration process");
      } else {
        console.error(error);
        alert(res.data);
      }
    }
  };
  return (
    <div className="flex flex-col">
      <div className="relative flex items-center justify-center flex-1 mt-1 p-14">
        <img
          src="/images/login-page-bg.png"
          className="absolute top-0 left-0 object-fill w-full h-full -z-10"
          alt="login-bg"
        />
        <div className="flex flex-col gap-16 p-24 bg-white shadow-xl">
          <div className="flex justify-center">
            <PrimaryHeading name="Sign In" />
          </div>
          <div className="flex gap-12">
            <div>
              <img
                src="images/login-bg.png"
                alt="login-bg.png"
                className="transition duration-200 shadow-xl hover:scale-110"
              />
            </div>
            <div className="flex flex-col gap-10">
              <div className="flex flex-col gap-3">
                <h1 className="flex gap-1 mb-3 font-semibold">
                  New User?
                  <Link to="/register">
                    <p className="font-medium text-blue-600 text-md">Sign Up</p>
                  </Link>
                </h1>
                <h1 className="text-4xl font-extrabold text-purple">
                  Welcome Back!
                </h1>
                <h1 className="text-lg text-mute">Login to continue</h1>
              </div>
              <div>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="flex flex-col gap-3">
                    <FormField
                      type="text"
                      placeholder="you@gmail.com"
                      error={errors.email}
                      register={register("email")}
                      name="email"
                      icon="fa-solid fa-envelope"
                    />
                    <FormField
                      type="password"
                      placeholder="Enter Password"
                      error={errors.password}
                      register={register("password")}
                      name="password"
                      icon="fa-solid fa-lock"
                    />

                    <div className="flex items-center gap-10">
                      <div>
                        <button
                          type="submit"
                          className="px-8 py-2.5 rounded-full bg-primary text-white"
                        >
                          {state === "submitting" ? (
                            <Loading
                              size={"text-lg"}
                              name="Authenticating..."
                            />
                          ) : (
                            <div>LOGIN</div>
                          )}
                        </button>
                      </div>
                      <div>
                        <Link to="/password-reset">
                          <button className="text-mute">
                            FORGOT PASSWORD ?
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
