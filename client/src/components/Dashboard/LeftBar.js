import React from "react";
import { useAuth } from "../../hooks/useAuth";
import APIButton from "./APIButton";

const LeftBar = () => {
  const { auth } = useAuth();
  return (
    <div className="flex flex-col gap-1">
      {["Admin"].includes(auth.user.role) && (
        <APIButton
          to={"Doctor"}
          name="Doctors"
          icon="fa-solid fa-user-doctor"
        />
      )}
      {["Doctor", "Admin"].includes(auth.user.role) && (
        <APIButton
          to={"Patient"}
          name="Patients"
          icon="fa-solid fa-bed-pulse"
        />
      )}
      {["Admin"].includes(auth.user.role) && (
        <APIButton
          to={"Nurse"}
          name="Nursing Staff"
          icon="fa-solid fa-user-nurse"
        />
      )}
      {["Admin"].includes(auth.user.role) && (
        <APIButton
          to={"Pharmacist"}
          name="Pharmacists"
          icon="fa-solid fa-prescription-bottle-medical"
        />
      )}
      {["Doctor", "Admin"].includes(auth.user.role) && (
        <APIButton
          to={"Medicine"}
          name="Medicines"
          icon="fa-solid fa-capsules"
        />
      )}
      {["Doctor", "Admin"].includes(auth.user.role) && (
        <APIButton to={"Disease"} name="Diseases" icon="fa-solid fa-viruses" />
      )}
      {["Nurse", "Admin"].includes(auth.user.role) && (
        <APIButton to="Tasks" name="Tasks" icon="fa-solid fa-list-check" />
      )}
    </div>
  );
};

export default LeftBar;
