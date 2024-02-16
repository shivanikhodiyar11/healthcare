import axios, { isAxiosError } from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import InvalidToken from "./InvalidToken";
import Loading from "./Loading";
const RegenerateToken = () => {
  const params = useParams();
  const [state, setState] = useState("loading");
  useEffect(() => {
    const regeneration = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_PATH_NAME}/user/token/regenerate`,
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
          }
        }
      }
    };
    if (state === "loading") regeneration();
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
  if (state === "success") {
    return (
      <div className="text-5xl text-success">
        <h1>Token Regenerated</h1>
      </div>
    );
  }
};

export default RegenerateToken;
