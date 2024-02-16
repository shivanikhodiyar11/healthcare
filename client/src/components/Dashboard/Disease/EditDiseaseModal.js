import { joiResolver } from "@hookform/resolvers/joi";
import axios from "axios";
import Joi from "joi";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../../../hooks/useAuth";
import Loading from "../../Loading";
import PrimaryHeading from "../../PrimaryHeading";
import FormField from "../../Register/FormField";
import Unauthorized from "../../Unauthorized";

const updateDiseaseSchema = Joi.object({
  _id: Joi.string().hex().length(24).required(),
  name: Joi.string().trim().min(3).label("Disease Name").messages({
    "string.empty": "Disease Name is required",
  }),
  causes: Joi.string()
    .required()
    .trim()
    .messages({ "string.empty": "Causes is required" }),
  treatment: Joi.string()
    .required()
    .trim()
    .messages({ "string.empty": "Treatment is required" }),
});

const EditDiseaseModal = ({ details, onUpdate }) => {
  const [showModal, setShowModal] = useState(false);
  const [state, setState] = useState("idle");
  const { auth } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: joiResolver(updateDiseaseSchema),
    mode: "all",
    defaultValues: {
      name: details.name,
      causes: details.causes,
      treatment: details.treatment,
    },
  });

  const updateDiseases = async (data) => {
    try {
      setState("submitting");
      const id = data._id;
      delete data._id;

      await axios.put(
        `http://localhost:4000/disease/update/${id}`,
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
                {state === "unauthorized" && <Unauthorized />}
                {state === "success" && (
                  <div className="flex justify-center gap-2 py-16 text-3xl font-medium first-line:items-center text-success px-28">
                    <span className="fa-solid fa-circle-check "></span>
                    <div>Disease Updated Successfully</div>
                  </div>
                )}
                {state === "idle" && (
                  <form onSubmit={handleSubmit(updateDiseases)}>
                    <div className="flex flex-col gap-5 px-10">
                      <PrimaryHeading name="Update Disease" />
                      <div className="flex flex-col gap-4">
                        <input
                          type="hidden"
                          defaultValue={details._id}
                          {...register("_id")}
                        />

                        <FormField
                          type="text"
                          error={errors.name}
                          register={register("name")}
                          placeholder="Disease Name"
                          name="name"
                          icon="fa-solid fa-virus"
                        />

                        <FormField
                          type="text"
                          error={errors.causes}
                          label="Causes: "
                          register={register("causes")}
                          placeholder="Causes of disease"
                          name="causes"
                          icon="fa-solid fa-head-side-cough"
                        />
                        <FormField
                          type="text"
                          error={errors.treatment}
                          label="Treatment:"
                          register={register("treatment")}
                          placeholder="Treatment of disease"
                          name="treatment"
                          icon="fa-solid fa-heart-circle-plus"
                        />

                        <div className="flex gap-5 my-5">
                          <div>
                            <button
                              className="px-6 py-2 text-sm font-bold text-white rounded-md bg-secondary"
                              type="submit"
                            >
                              Save
                            </button>
                          </div>
                          <div>
                            <button
                              className="px-6 py-2 text-sm font-bold text-white bg-red-600 rounded-md"
                              type="button"
                              onClick={() => setShowModal(false)}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>
                )}
                {state === "error" && (
                  <div className="flex justify-center gap-2 py-16 text-3xl font-medium text-red-700 first-line:items-center px-28">
                    <span className="fa-solid fa-circle-exclamation "></span>
                    <div>Error while updating Disease</div>
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

export default EditDiseaseModal;
