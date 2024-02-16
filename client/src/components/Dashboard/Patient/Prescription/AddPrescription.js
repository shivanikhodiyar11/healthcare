import { joiResolver } from "@hookform/resolvers/joi";
import axios from "axios";
import Joi from "joi";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../../../../hooks/useAuth";

import Loading from "../../../Loading";
import PrimaryHeading from "../../../PrimaryHeading";
import AsyncSelect from "react-select/async";
import Unauthorized from "../../../Unauthorized";

const addPrescriptionSchema = Joi.object({
  patient: Joi.string().hex().length(24).required(),
  diseases: Joi.array().items(Joi.string()).required().min(1).messages({
    "array.min": "Disease is required",
    "any.required": "Disease is required",
  }),
  medicines: Joi.array().items(Joi.string()).required().min(1).messages({
    "array.min": "Medicine is required",
    "array.base": "Medicine is required",
  }),
  notes: Joi.string().allow(""),
  prescribedBy: Joi.string().hex().length(24).required().messages({
    "any.required": "Doctor Name is required",
  }),
});

const AddPrescription = ({ detail, onAdd }) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div>
      <button
        className="flex items-center w-full gap-2 px-3 py-2 text-white bg-green-700 rounded-md whitespace-nowrap"
        onClick={() => {
          setShowModal(true);
        }}
      >
        <span className="fa-solid fa-plus"></span>
        <p>Add Prescription</p>
      </button>

      {showModal && (
        <PrescriptionForm
          detail={detail}
          onAdd={onAdd}
          onClose={() => {
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
};

export default AddPrescription;

function PrescriptionForm({ onClose, detail, onAdd }) {
  const [state, setState] = useState("idle");
  const { auth } = useAuth();
  const [fetching, setFetching] = useState(true);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: joiResolver(addPrescriptionSchema),
    mode: "all",
  });
  console.log(errors);
  const getDiseases = (inputValue, callback) => {
    setFetching(true);
    axios
      .get(`${process.env.REACT_APP_PATH_NAME}/disease`, {
        headers: { authorization: auth.token },
        params: { search: inputValue || "" },
      })
      .then((res) => {
        const options = res.data.diseases.map((disease) => {
          return { value: disease._id, label: disease?.name };
        });
        callback(options);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setFetching(false);
      });
  };
  const getDoctors = (inputValue, callback) => {
    console.log(inputValue);
    axios
      .get(`${process.env.REACT_APP_PATH_NAME}/user/approved-doctor`, {
        headers: { authorization: auth.token },
        params: { search: inputValue || "" },
      })
      .then((res) => {
        const options = res.data.map((doctor) => {
          return {
            value: doctor._id,
            label: doctor?.first_name + " " + doctor?.last_name,
          };
        });
        callback(options);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const [medicines, setMedicines] = useState();

  useEffect(() => {
    const getMedicines = () => {
      axios
        .get(`${process.env.REACT_APP_PATH_NAME}/medicine`, {
          headers: { authorization: auth.token },
          params: { search: "" },
        })
        .then((res) => {
          const data = res.data.medicines.map((medicine) => {
            return { value: medicine._id, label: medicine?.name };
          });
          setMedicines(data);
        })
        .catch((error) => {
          console.log(error);
        });
    };

    getMedicines();
  }, [auth.token]);

  const onSubmit = async (data) => {
    try {
      setState("submitting");
      const res = await axios.post(
        `${process.env.REACT_APP_PATH_NAME}/prescription`,
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
                <Loading name="Adding..." size="text-xl"></Loading>
              </div>
            )}
            {state === "unauthorized" && <Unauthorized />}
            {state === "success" && (
              <div className="flex justify-center gap-2 py-16 text-3xl font-medium first-line:items-center text-success px-28">
                <span className="fa-solid fa-circle-check "></span>
                <span>Prescription Added !</span>
              </div>
            )}
            {fetching && (
              <div className="absolute inset-0 z-50 flex items-center justify-center text-3xl bg-white ">
                <span className="fa-solid fa-hurricane fa-spin"></span>
              </div>
            )}
            {state === "idle" && (
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-6 px-10 font-medium text-start text-secondary">
                  <div className="p-2">
                    <PrimaryHeading name="Add Prescription" />
                  </div>
                  <input
                    type="hidden"
                    defaultValue={detail}
                    {...register("patient")}
                  />
                  <div>
                    <h2>Choose Diseases:</h2>
                    <AsyncSelect
                      isMulti
                      cacheOptions
                      onChange={(value) => {
                        setValue(
                          "diseases",
                          value.map((i) => i.value),
                          { shouldDirty: true, shouldValidate: true }
                        );
                      }}
                      loadOptions={getDiseases}
                      defaultOptions
                    />
                    {errors.diseases && (
                      <span className="flex items-center gap-2 m-1 text-red-600">
                        <span className="fa-solid fa-circle-exclamation"></span>
                        {errors.diseases.message}
                      </span>
                    )}
                  </div>
                  <div>
                    <h2>Choose Medicines:</h2>
                    {medicines?.map((item) => {
                      return (
                        <div className="flex items-center h-5" key={item.value}>
                          <label className="flex items-center gap-2 text-md text-secondary">
                            <input
                              type="checkbox"
                              {...register("medicines")}
                              value={item.value}
                              className="w-4 h-4 border border-gray-300 rounded bg-gray-50"
                            />
                            {item.label}
                          </label>
                        </div>
                      );
                    })}
                    {errors.medicines && (
                      <span className="flex items-center gap-2 m-1 text-red-600">
                        <span className="fa-solid fa-circle-exclamation"></span>
                        {errors.medicines.message}
                      </span>
                    )}
                  </div>
                  <div>
                    <h2>Prescribed By:</h2>

                    <AsyncSelect
                      cacheOptions
                      defaultOptions
                      onChange={(item) => {
                        setValue("prescribedBy", item.value, {
                          shouldDirty: true,
                          shouldValidate: true,
                        });
                      }}
                      // value={{
                      //   value: auth.user._id,
                      //   label: auth.user.first_name + " " + auth.user.last_name,
                      // }}
                      loadOptions={getDoctors}
                    />

                    {errors.prescribedBy && (
                      <span className="flex items-center gap-2 m-1 text-red-600">
                        <span className="fa-solid fa-circle-exclamation"></span>
                        {errors.prescribedBy.message}
                      </span>
                    )}
                  </div>
                  <div>
                    <label htmlFor="notes" className="block">
                      Notes:
                    </label>
                    <textarea
                      {...register("notes")}
                      rows="4"
                      className="block p-2.5 w-full border "
                      placeholder="Notes.."
                    ></textarea>
                    {errors.notes && (
                      <span className="flex items-center gap-2 m-1 text-red-600">
                        <span className="fa-solid fa-circle-exclamation"></span>
                        {errors.notes.message}
                      </span>
                    )}
                  </div>

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
                <div>Error while adding prescription</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
