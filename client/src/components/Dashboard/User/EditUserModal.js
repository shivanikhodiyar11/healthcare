import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../../../hooks/useAuth";
import Loading from "../../Loading";
import PrimaryHeading from "../../PrimaryHeading";
import AddUserForm from "./NewUserForm";
import Unauthorized from "../../Unauthorized";

const EditUserModal = ({ details, onUpdate }) => {
  const [showModal, setShowModal] = useState(false);
  const [state, setState] = useState("idle");
  const { auth } = useAuth();

  const updateUsers = () => {
    return async (data) => {
      try {
        setState("submitting");
        await axios.put(
          `${process.env.REACT_APP_PATH_NAME}/user/update/${details._id}`,
          { ...data },
          {
            headers: { authorization: auth.token },
          }
        );
        setState("success");
        onUpdate();
      } catch (error) {
        if (error.response.status === 404 || error.response.status === 500) {
          alert("User already exists");
          setState("error");
        } else if (error.response.status === 401) {
          setState("unauthorized");
        }
        console.log(error);
      }
    };
  };

  return (
    <div>
      <button
        className="px-2 py-1 bg-gray-200 rounded-full"
        type="button"
        onClick={() => {
          setShowModal(true);
        }}
      >
        <span className="text-yellow-500 fa-solid fa-pencil"></span>
      </button>
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
                    <Loading name="Updating..." size="text-xl"></Loading>
                  </div>
                )}
                {state === "success" && (
                  <div className="flex justify-center gap-2 py-16 text-3xl font-medium first-line:items-center text-success px-28">
                    <span className="fa-solid fa-circle-check "></span>
                    <div>{details.role} Updated Successfully</div>
                  </div>
                )}
                {state === "unauthorized" && <Unauthorized />}
                {state === "idle" && (
                  <div className="flex flex-col gap-7">
                    <PrimaryHeading name={`Edit ${details.role}`} />
                    <AddUserForm details={details} onSubmit={updateUsers} />
                  </div>
                )}
                {state === "error" && (
                  <div className="flex justify-center gap-2 py-16 text-3xl font-medium text-red-700 first-line:items-center px-28">
                    <span className="fa-solid fa-circle-exclamation "></span>
                    <div>Error while updating record</div>
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

export default EditUserModal;
