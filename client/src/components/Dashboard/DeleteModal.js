import axios from "axios";
import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import Loading from "../Loading";

const DeleteModal = ({ details, onDelete, path }) => {
  const [showModal, setShowModal] = useState(false);
  const [state, setState] = useState("idle");
  const { auth } = useAuth();

  const deleteData = async (id) => {
    try {
      setState("submitting");
      await axios.delete(`${process.env.REACT_APP_PATH_NAME}/${path}/${id}`, {
        headers: { authorization: auth.token },
      });
      setState("success");
      onDelete();
    } catch (error) {
      if (error.response.status === 400) {
        setState("error");
      } else if (error.response.status === 401) {
        setState("unauthorized");
      }
      console.log(error);
    }
  };

  return (
    <div>
      <button
        className="px-2 py-1 bg-gray-200 rounded-full"
        type="button"
        onClick={() => setShowModal(true)}
      >
        <span className="text-red-600 fa-solid fa-trash"></span>
      </button>
      {showModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <div className="relative w-auto max-w-3xl ">
            <div className="relative flex flex-col w-full bg-white rounded-lg shadow-lg ">
              <div className="flex justify-end p-3 rounded-t ">
                <button onClick={() => setShowModal(false)}>
                  <span className="text-2xl fa-solid fa-xmark"></span>
                </button>
              </div>

              <div className="relative flex flex-col gap-5 p-3 text-center">
                {state === "submitting" && (
                  <div className="py-16 px-28">
                    <Loading name="Deleting..." size="text-xl"></Loading>
                  </div>
                )}
                {state === "success" && (
                  <div className="flex justify-center gap-2 py-16 text-3xl font-medium first-line:items-center text-success px-28">
                    <span className="fa-solid fa-circle-check "></span>
                    <div>Deleted Successfully</div>
                  </div>
                )}
                {state === "idle" && (
                  <div>
                    <div className="flex flex-col gap-5 p-2">
                      <div className="flex items-center justify-center gap-2 text-3xl text-yellow-500">
                        <h1>Alert</h1>
                        <span className="fa-solid fa-circle-exclamation"></span>
                      </div>

                      <h3 className="mb-5 text-lg font-normal text-gray-500">
                        Are you sure you want to delete this?
                      </h3>
                    </div>

                    <div className="flex justify-center gap-5 p-2">
                      <button
                        className="px-6 py-2 text-sm font-bold text-white bg-red-600 rounded-md"
                        type="button"
                        onClick={(e) => deleteData(details._id)}
                      >
                        Yes, I'm sure
                      </button>
                      <button
                        className="px-6 py-2 text-sm font-bold rounded-md text-mute bg-slate-200"
                        type="button"
                        onClick={() => setShowModal(false)}
                      >
                        No, Cancel
                      </button>
                    </div>
                  </div>
                )}
                {state === "error" && (
                  <div className="flex justify-center gap-2 py-16 text-3xl font-medium text-red-700 first-line:items-center px-28">
                    <span className="fa-solid fa-circle-exclamation "></span>
                    <div>Disease exist in Prescription</div>
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

export default DeleteModal;
