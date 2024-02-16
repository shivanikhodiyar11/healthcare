import axios from "axios";
import React, { useState } from "react";
import { useAuth } from "../../../../hooks/useAuth";
import Logo from "../../../Logo";
import CardInfo from "../../CardInfo";
import DeleteModal from "../../DeleteModal";
import LineHeading from "../../LineHeading";
import Unauthorized from "../../../Unauthorized";

const ViewMultiplePrescription = ({ detail, onDelete }) => {
  const { auth } = useAuth();

  const [showModal, setShowModal] = useState(false);
  const [page, setPage] = useState(1);
  const [state, setState] = useState();
  const [res, setRes] = useState();

  const prescription = res?.prescription?.[page - 1];

  const pages = () => {
    if (res)
      return Array.from({ length: res.prescription.length }, (_, i) => i + 1);
  };
  const getPrescription = (id) => {
    setState("fetching");
    axios
      .get(`${process.env.REACT_APP_PATH_NAME}/prescription/${id}`, {
        headers: { authorization: auth.token },
      })
      .then((res) => {
        setRes(res.data);
        setState("success");
      })
      .catch((error) => {
        if (error.response.status === 400) {
          setState("error");
        } else if (error.response.status === 401) {
          setState("unauthorized");
        }
        console.log(error);
      });
  };
  return (
    <div>
      <button
        className="flex items-center gap-2 p-2 text-white rounded-md bg-secondary whitespace-nowrap"
        onClick={() => {
          setShowModal(true);
          getPrescription(detail);
        }}
      >
        <span className="fa-regular fa-eye"></span>View Prescription
      </button>
      {showModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <div className="container relative bg-white rounded-lg shadow-lg min-h-[24rem] max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 z-50 flex items-center justify-between p-5 bg-white border-b-2 rounded-t border-secondary ">
              <h1 className="text-3xl font-bold font-prata-style text-secondary">
                Healthcare Management
              </h1>
              <button onClick={() => setShowModal(false)}>
                <span className="text-2xl fa-solid fa-xmark"></span>
              </button>
            </div>
            {state === "fetching" && (
              <div className="absolute inset-0 flex items-center justify-center text-3xl bg-white">
                <span className="fa-solid fa-hurricane fa-spin"></span>
              </div>
            )}
            {state === "unauthorized" && <Unauthorized />}
            {state === "error" && (
              <div className="px-24 font-bold text-center py-14">
                <h1 className="text-3xl text-red-600">
                  Prescription Does Not Exist
                </h1>
              </div>
            )}
            {prescription && (
              <div
                className="relative flex flex-col gap-5 px-4"
                key={prescription._id}
              >
                <div className="flex flex-col">
                  <div className="flex items-center justify-between px-4">
                    <div className="flex-1 text-center">
                      <div className="">
                        <Logo />
                      </div>
                    </div>
                    <div className="whitespace-nowrap">
                      <CardInfo
                        icon="fa-solid fa-user-doctor"
                        label="Doctor Name:"
                        value={`${prescription.prescribedBy.first_name} ${prescription.prescribedBy.last_name}`}
                      />
                      <CardInfo
                        icon="fa-solid fa-envelope"
                        label="Email:"
                        value={prescription.prescribedBy.email}
                      />
                      <CardInfo
                        icon="fa-solid fa-phone"
                        label="Contact No:"
                        value={prescription.prescribedBy.phoneNo}
                      />
                      <CardInfo
                        // icon="fa-regular fa-calender-days"
                        label="Date:"
                        value={new Date(
                          prescription.createdAt
                        ).toLocaleDateString()}
                      />
                    </div>
                  </div>
                  <LineHeading name="Patient Details" />
                  <div className="px-6 py-3 columns-2">
                    <CardInfo
                      label="Patient Name:"
                      value={prescription.patient.name}
                    />
                    <CardInfo
                      label="Gender:"
                      value={prescription.patient.gender}
                    />
                    <CardInfo
                      label="Temperature:"
                      value={prescription.patient.temperature}
                    />
                    <CardInfo
                      label="Blood Pressure:"
                      value={prescription.patient.bloodPressure}
                    />
                    <CardInfo
                      label="Sugar Level:"
                      value={prescription.patient.sugarLevel}
                    />

                    <CardInfo
                      label="Blood Group:"
                      value={prescription.patient.bloodGroup}
                    />
                  </div>
                  <LineHeading name="Disease" />
                  <div className="grid grid-cols-3 gap-4 p-4 ">
                    {prescription.diseases.map((item) => {
                      return (
                        <div
                          key={item.name}
                          className="px-4 py-2 border rounded-lg"
                        >
                          <CardInfo
                            icon="fa-solid fa-viruses"
                            label="Disease Name:"
                            value={item.name}
                          />
                          <CardInfo label="Causes:" value={item.causes} />
                          <CardInfo label="Treatment:" value={item.treatment} />
                        </div>
                      );
                    })}
                  </div>

                  <LineHeading name="Medicine" />
                  <div className="grid grid-cols-3 gap-4 p-4">
                    {prescription.medicines.map((item) => {
                      return (
                        <div
                          key={item.name}
                          className="px-4 py-2 border rounded-lg"
                        >
                          <CardInfo
                            icon="fa-solid fa-capsules"
                            label="Medicine Name:"
                            value={item.name}
                          />
                          <CardInfo label="Dosage:" value={item.dosage} />
                          <CardInfo
                            label="Manufactured By:"
                            value={item.mfgBy}
                          />
                          <CardInfo
                            label="Side Effects:"
                            value={item.sideEffects}
                          />
                        </div>
                      );
                    })}
                  </div>
                  <LineHeading name="Notes" />
                  <div className="p-4">
                    <div className="p-4 bg-slate-200">
                      <p className="">{prescription.notes}</p>
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 p-5 ">
                    {/* <EditPrescriptionModal
                      details={prescription._id}
                      onUpdate={getPrescription}
                    /> */}
                    <DeleteModal
                      details={prescription}
                      onDelete={onDelete}
                      path="prescription/delete"
                    />
                  </div>
                  {pages() && (
                    <div className="flex items-center justify-between p-3">
                      <div className="flex gap-3">
                        <div className="text-lg font-bold text-secondary">
                          <h1>Page:</h1>
                        </div>

                        {pages().map((p) => {
                          return (
                            <div className="text-lg" key={p}>
                              <button
                                className="px-2 rounded-full bg-slate-300"
                                onClick={() => setPage(p)}
                              >
                                {p}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ViewMultiplePrescription;
