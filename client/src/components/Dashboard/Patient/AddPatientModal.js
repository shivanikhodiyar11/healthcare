import React, { useState } from "react";
import PrimaryButton from "../../Header/PrimaryButton";
import axios from "axios";
import { useAuth } from "../../../hooks/useAuth";
import Loading from "../../Loading";
import NewPatientForm from "./NewPatientForm";
import PrimaryHeading from "../../PrimaryHeading";
import Unauthorized from "../../Unauthorized";

const AddPatientModal = ({ onAdd }) => {
  const [showModal, setShowModal] = useState(false);
  const [state, setState] = useState("idle");
  const { auth } = useAuth();

  const onSubmit = (reset) => {
    return async (data) => {
      try {
        setState("submitting");
        data.bloodPressure = `${data.bloodPressure} (mmHg)`;
        data.sugarLevel = `${data.sugarLevel} (mg/dL)`;
        data.temperature = `${data.temperature} °F`;
        data.weight = `${data.weight} kg`;
        const res = await axios.post(
          `${process.env.REACT_APP_PATH_NAME}/patient`,
          data,
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
        if (error.response.status === 404) {
          setState("error");
        } else if (error.response.status === 401) {
          setState("unauthorized");
        }
        console.error(error);
        // alert(error.response.data);
      }
    };
  };

  return (
    <div>
      <PrimaryButton
        name="Add New Patient"
        onClick={() => {
          setShowModal(true);
        }}
      />

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
                    <Loading name="Adding..." size="text-xl"></Loading>
                  </div>
                )}
                {state === "unauthorized" && <Unauthorized />}
                {state === "success" && (
                  <div className="flex justify-center gap-2 py-16 text-3xl font-medium first-line:items-center text-success px-28">
                    <span className="fa-solid fa-circle-check "></span>
                    <div>Patient Added Successfully!</div>
                  </div>
                )}
                {state === "idle" && (
                  <div className="flex flex-col gap-7">
                    <PrimaryHeading name="Add New Patient" />
                    <NewPatientForm onSubmit={onSubmit} />
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

export default AddPatientModal;
