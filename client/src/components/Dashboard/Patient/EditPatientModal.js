import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../../../hooks/useAuth";
import Loading from "../../Loading";
import Unauthorized from "../../Unauthorized";
import NewPatientForm from "./NewPatientForm";
import PrimaryHeading from "../../PrimaryHeading";

const EditPatientModal = ({ details, onUpdate }) => {
  const [showModal, setShowModal] = useState(false);
  const [state, setState] = useState("idle");
  const { auth } = useAuth();

  const updatePatients = () => {
    return async (data) => {
      try {
        setState("submitting");
        data.bloodPressure = `${data.bloodPressure} (mmHg)`;
        data.sugarLevel = `${data.sugarLevel} (mg/dL)`;
        data.temperature = `${data.temperature} °F`;
        data.weight = `${data.weight} kg`;

        await axios.put(
          `${process.env.REACT_APP_PATH_NAME}/patient/update/${details._id}`,
          { ...data },
          {
            headers: { authorization: auth.token },
          }
        );
        setState("success");
        onUpdate();
      } catch (error) {
        if (error.response.status === 404) {
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <div className="relative w-auto ">
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

              <div className="relative flex flex-col p-3 text-center">
                {state === "submitting" && (
                  <div className="py-16 px-28">
                    <Loading name="Updating..." size="text-xl"></Loading>
                  </div>
                )}
                {state === "unauthorized" && <Unauthorized />}
                {state === "success" && (
                  <div className="flex justify-center gap-2 py-16 text-3xl font-medium first-line:items-center text-success px-28">
                    <span className="fa-solid fa-circle-check "></span>
                    <div>Patient Updated Successfully!</div>
                  </div>
                )}

                {state === "idle" && (
                  <div className="flex flex-col gap-7">
                    <PrimaryHeading name="Edit Patient" />
                    <NewPatientForm
                      details={details}
                      onSubmit={updatePatients}
                    />
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

export default EditPatientModal;
