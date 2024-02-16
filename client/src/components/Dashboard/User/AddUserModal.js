import axios from "axios";
import React, { useState } from "react";
import Loading from "../../Loading";
import PrimaryHeading from "../../PrimaryHeading";
import { useAuth } from "../../../hooks/useAuth";
import PrimaryButton from "../../Header/PrimaryButton";
import { useParams } from "react-router-dom";
import NewUserForm from "./NewUserForm";
import Unauthorized from "../../Unauthorized";

const AddUserModal = ({ onAdd }) => {
  const [state, setState] = useState("idle");
  const [showModal, setShowModal] = useState(false);
  const { auth } = useAuth();
  const { role } = useParams();

  const onSubmit = (reset) => {
    return async (data) => {
      try {
        setState("submitting");
        const res = await axios.post(
          `${process.env.REACT_APP_PATH_NAME}/user/create-user`,
          { ...data, role },
          {
            headers: { authorization: auth.token },
          }
        );
        if (res.status === 200) {
          reset();
          setState("success");
          onAdd();
        }
      } catch (error) {
        if (error.response.status === 404 || error.response.status === 403) {
          setState("error");
        } else if (error.response.status === 401) {
          setState("unauthorized");
        }
        console.error(error);
        alert(error.response.data);
      }
    };
  };

  return (
    <div>
      <PrimaryButton
        name={`Add New ${role}`}
        onClick={() => {
          setShowModal(true);
        }}
      />
      {showModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 ">
          <div className="relative w-auto max-w-3xl ">
            <div className="relative flex flex-col w-full bg-white rounded-lg shadow-lg ">
              <div className="flex justify-end p-3 rounded-t ">
                <button
                  onClick={() => {
                    setShowModal(false);
                    setState("idle");
                  }}
                >
                  <span className="text-2xl fa-solid fa-xmark"></span>
                </button>
              </div>

              <div className="relative flex flex-col gap-5 p-3 text-center">
                {state === "submitting" && (
                  <div className="py-16 px-28">
                    <Loading name="Adding..." size="text-xl"></Loading>
                  </div>
                )}
                {state === "unauthorized" && <Unauthorized />}
                {state === "success" && (
                  <div className="flex justify-center gap-2 py-16 text-3xl font-medium first-line:items-center text-success px-28">
                    <span className="fa-solid fa-circle-check "></span>
                    <div>{role} Added !</div>
                  </div>
                )}
                {state === "idle" && (
                  <div className="flex flex-col gap-7">
                    <PrimaryHeading name={`Add New ${role}`} />
                    <NewUserForm onSubmit={onSubmit} />
                  </div>
                )}
                {state === "error" && (
                  <div className="flex justify-center gap-2 py-16 text-3xl font-medium text-red-700 first-line:items-center px-28">
                    <span className="fa-solid fa-circle-exclamation "></span>
                    <div>Error while adding {role}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default AddUserModal;
