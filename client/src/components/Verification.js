import React, { useEffect, useState } from "react";
import { Navigate, useParams, useSearchParams } from "react-router-dom";
import PrimaryButton from "./Header/PrimaryButton";
import axios, { isAxiosError } from "axios";
import Loading from "./Loading";
import InvalidToken from "./InvalidToken";

const Verification = () => {
  const params = useParams();
  const [searchParams] = useSearchParams();
  const [state, setState] = useState("loading");
  useEffect(() => {
    const verification = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_PATH_NAME}/user/token/verify`,
          {
            params,
          }
        );
        if (res.status === 200) {
          setState("success");
        }
      } catch (error) {
        setState("error");
        if (isAxiosError(error)) {
          const status = error.response.status;
          if (status === 401) {
            setState("invalid");
          } else if (status === 403) {
            setState("expired");
          }
        }
      }
    };
    verification();
  });

  if (state === "loading") {
    return (
      <div className="flex justify-center text-5xl">
        <Loading size="text-5xl" name="Loading..." />
      </div>
    );
  }

  if (state === "invalid") {
    return <InvalidToken />;
  }
  if (state === "expired") {
    return (
      <div className="flex flex-col items-center justify-center gap-3 text-3xl h-96">
        <div className="flex gap-2 text-red-500">
          <span className="fa-solid fa-circle-xmark"></span>
          <h1>Token Expired</h1>
        </div>
        <div>
          <PrimaryButton
            name="Regenerate Token"
            link={"/token/regenerate/" + params.token}
          />
        </div>
      </div>
    );
  }
  if (state === "success") {
    return (
      <Navigate to={"/set-password/" + params.token + "?" + searchParams} />
      // <div className="flex flex-col items-center justify-center gap-4 text-4xl h-96 text-success">
      //   <h1>Your Em@il is Verified!!</h1>
      //   <PrimaryButton
      //     name="Create Password"
      //     link={"/create-password/" + params.token}
      //   />
      // </div>
    );
  }
};

export default Verification;
