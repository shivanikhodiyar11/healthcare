import axios from "axios";
import React, { useState } from "react";
import { useAuth } from "../../../../hooks/useAuth";
import Logo from "../../../Logo";
import CardInfo from "../../CardInfo";
import DeleteModal from "../../DeleteModal";
import EditTaskModal from "./EditTaskModal";
import LineHeading from "../../LineHeading";
import Unauthorized from "../../../Unauthorized";

const ViewTask = ({ detail, onDelete }) => {
  const { auth } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [state, setState] = useState();
  const [task, setTask] = useState({});
  const getTask = (id) => {
    setState("fetching");
    axios
      .get(`${process.env.REACT_APP_PATH_NAME}/nurse-task/${id}`, {
        headers: { authorization: auth.token },
      })
      .then((res) => {
        setTask(res.data);
        setState("success");
      })
      .catch((error) => {
        if (error.response.status === 404) {
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
        className="flex items-center w-full gap-1 p-2 my-2 text-white rounded-md bg-purple whitespace-nowrap"
        onClick={() => {
          setShowModal(true);
          getTask(detail);
        }}
      >
        <span className=" fa-solid fa-list-check"></span>
        <p>View Task</p>
      </button>
      {showModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <div className="container relative bg-white rounded-lg shadow-lg min-h-[24rem] max-h-[90vh] overflow-y-auto max-w-3xl">
            <div className="sticky top-0 z-50 flex items-center justify-between p-5 bg-white rounded-t ">
              <div className="">
                <Logo />
              </div>
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
            {state === "success" && (
              <div className="relative flex flex-col gap-3 px-10 py-3">
                <LineHeading name="Task Details" />
                <div className="text-xl">
                  <CardInfo
                    icon="fa-solid fa-pen-to-square"
                    label="Title:"
                    value={task.taskTitle}
                  />
                  <CardInfo label="Description:" value={task.taskDescription} />
                  <CardInfo label="Status:" value={task.status} />
                  <div className="flex justify-end gap-3 p-3">
                    <EditTaskModal detail={task} onUpdate={getTask} />
                    <DeleteModal
                      details={task}
                      onDelete={onDelete}
                      path="nurse-task/delete"
                    />
                  </div>
                </div>
              </div>
            )}

            {state === "error" && (
              <div className="px-24 font-bold text-center py-14">
                <h1 className="text-3xl text-red-600">Task Does Not Exist</h1>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ViewTask;
