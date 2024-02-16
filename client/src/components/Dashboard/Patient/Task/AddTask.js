import { joiResolver } from "@hookform/resolvers/joi";
import axios from "axios";
import Joi from "joi";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../../../../hooks/useAuth";
import Loading from "../../../Loading";
import PrimaryHeading from "../../../PrimaryHeading";
import FormField from "../../../Register/FormField";
import Unauthorized from "../../../Unauthorized";

const addTaskSchema = Joi.object({
  patient: Joi.string().hex().length(24).required(),
  taskTitle: Joi.string()
    .required()
    .trim()
    .messages({ "string.empty": "Title is required" }),
  taskDescription: Joi.string()
    .required()
    .trim()
    .messages({ "string.empty": "Description is required" }),
  status: Joi.string()
    .valid("Pending", "Under Process", "Completed")
    .default("Pending"),
});

const AddTask = ({ detail, onAdd }) => {
  const [showModal, setShowModal] = useState(false);
  const [state, setState] = useState("idle");

  const { auth } = useAuth();

  const onSubmit = async (data) => {
    try {
      setState("submitting");
      const res = await axios.post(
        `${process.env.REACT_APP_PATH_NAME}/nurse-task`,
        data,
        {
          headers: { authorization: auth.token },
        }
      );

      if (res.status === 200) {
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
      alert(error.response.data);
    }
  };
  return (
    <div>
      <button
        className="flex items-center w-full gap-2 p-2 my-2 text-white rounded-md bg-cyan-600 justify-items-start whitespace-nowrap"
        onClick={() => {
          setShowModal(true);
        }}
      >
        <span className="fa-solid fa-pen-to-square"></span>
        <p>Assign Task</p>
      </button>
      {showModal && (
        <TaskForm
          detail={detail}
          state={state}
          onSubmit={onSubmit}
          onClose={() => {
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
};

export default AddTask;

export function TaskForm({
  onClose,
  detail,
  onSubmit,
  state,
  defaultValues = {},
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: joiResolver(addTaskSchema),
    mode: "all",
    defaultValues,
  });
  console.log(errors);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 ">
      <div className="relative w-auto">
        <div className="relative flex flex-col w-full bg-white rounded-lg shadow-lg ">
          <div className="flex justify-end p-3 rounded-t ">
            <button
              onClick={() => {
                onClose();
              }}
            >
              <span className="text-2xl fa-solid fa-xmark"></span>
            </button>
          </div>
          <div className="relative flex flex-col gap-5 p-3 text-center">
            {state === "submitting" && (
              <div className="py-16 px-28">
                {Object.keys(defaultValues).length > 0 ? (
                  <Loading name="Updating..." size="text-xl"></Loading>
                ) : (
                  <Loading name="Adding..." size="text-xl"></Loading>
                )}
              </div>
            )}
            {state === "unauthorized" && <Unauthorized />}
            {state === "success" && (
              <div className="flex justify-center gap-2 py-16 text-3xl font-medium first-line:items-center text-success px-28">
                <span className="fa-solid fa-circle-check "></span>
                <span>Task Added !</span>
              </div>
            )}

            {state === "idle" && defaultValues && (
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-6 px-10 font-medium text-start text-secondary">
                  <div className="p-2 text-center">
                    {Object.keys(defaultValues).length > 0 ? (
                      <PrimaryHeading name="Edit Task" />
                    ) : (
                      <PrimaryHeading name="Add Task" />
                    )}
                  </div>
                  <input
                    type="hidden"
                    defaultValue={detail}
                    {...register("patient")}
                  />
                  <div>
                    <FormField
                      type="text"
                      error={errors.taskTitle}
                      register={register("taskTitle")}
                      placeholder="Enter Title"
                      name="taskTitle"
                      icon="fa-solid fa-pen-to-square"
                    />
                  </div>
                  <div>
                    <label htmlFor="description" className="block">
                      Description:
                    </label>
                    <textarea
                      {...register("taskDescription")}
                      rows="4"
                      className="block p-2.5 w-full border "
                      placeholder="Enter task description"
                    ></textarea>
                    {errors.taskDescription && (
                      <span className="flex items-center gap-2 m-1 text-red-600">
                        <span className="fa-solid fa-circle-exclamation"></span>
                        {errors.taskDescription.message}
                      </span>
                    )}
                  </div>
                  {Object.keys(defaultValues).length > 0 && (
                    <div>
                      <div>
                        <label
                          htmlFor="status"
                          className="flex justify-start mb-1 text-secondary"
                        >
                          Status:
                        </label>
                        <select
                          id="status"
                          className="border w-full p-2.5 bg-white"
                          defaultValue={"DEFAULT"}
                          {...register("status")}
                        >
                          <option value="DEFAULT" disabled>
                            Select Task Status
                          </option>
                          <option value="Pending">Pending</option>
                          <option value="Under Process">Under Process</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </div>
                      {errors.status && (
                        <span className="flex items-center gap-2 m-1 text-red-600">
                          <span className="fa-solid fa-circle-exclamation"></span>
                          {errors.status.message}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="my-3">
                    <button
                      type="submit"
                      className="px-8 py-2.5 rounded-full bg-primary text-white "
                    >
                      {state === "submitting" ? (
                        <Loading size={"text-lg"} name="Loading..." />
                      ) : (
                        <span>SUBMIT</span>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            )}
            {state === "error" && (
              <div className="flex justify-center gap-2 py-16 text-3xl font-medium text-red-700 first-line:items-center px-28">
                <span className="fa-solid fa-circle-exclamation "></span>
                <div>Error while adding task</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
