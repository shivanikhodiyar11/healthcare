import axios from "axios";
import React, { useState } from "react";
import { useAuth } from "../../../../hooks/useAuth";
import { TaskForm } from "./AddTask";

const EditTaskModal = ({ detail, onUpdate }) => {
  const [showModal, setShowModal] = useState(false);
  const [state, setState] = useState("idle");
  const { auth } = useAuth();

  const onSubmit = async (data) => {
    try {
      setState("submitting");
      const res = await axios.put(
        `${process.env.REACT_APP_PATH_NAME}/nurse-task/update/${detail._id}`,
        data,
        {
          headers: { authorization: auth.token },
        }
      );

      if (res.status === 200) {
        setState("success");
        onUpdate(detail.patient._id);
      }
    } catch (error) {
      console.error(error);
      if (error.response.status === 404) {
        setState("error");
      } else if (error.response.status === 401) {
        setState("unauthorized");
      }
      alert(error.response.data);
    }
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
      {showModal && (
        <div>
          <TaskForm
            detail={detail.patient._id}
            state={state}
            onSubmit={onSubmit}
            onClose={() => {
              setShowModal(false);
            }}
            defaultValues={{
              status: detail.status,
              taskDescription: detail.taskDescription,
              taskTitle: detail.taskTitle,
            }}
          />
        </div>
      )}
    </div>
  );
};

export default EditTaskModal;
