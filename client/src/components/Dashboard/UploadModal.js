import React, { useState } from "react";
import PrimaryButton from "../Header/PrimaryButton";
import Loading from "../Loading";
import PrimaryHeading from "../PrimaryHeading";
import { read, utils } from "xlsx";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useAuth } from "../../hooks/useAuth";
import CardInfo from "./CardInfo";

const UploadModal = ({ onAdd, path, name, icon }) => {
  const [showModal, setShowModal] = useState(false);
  const [state, setState] = useState("idle");
  const { auth } = useAuth();
  const [res, setRes] = useState([]);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: "all",
  });

  const onSubmit = async (form) => {
    try {
      setState("submitting");
      const wb = read(await form.file[0].arrayBuffer());
      //   console.log(wb);
      const data = utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
      //   console.log(data);
      const res = await axios.post(
        `${process.env.REACT_APP_PATH_NAME}${path}`,
        data,
        {
          headers: { authorization: auth.token },
        }
      );
      if (res.status === 200) {
        reset();
        setState("success");
        onAdd();
      } else {
        setRes(res);
        setState("warning");
        onAdd();
      }
    } catch (error) {
      console.error(error);
      alert(error.response.data);
      setState("error");
    }
  };
  return (
    <div>
      <PrimaryButton
        name={`Add New ${name}`}
        onClick={() => {
          setShowModal(true);
        }}
      />
      {showModal && (
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

              <div className="relative p-3 text-center">
                {state === "submitting" && (
                  <div className="py-16 px-28">
                    <Loading name="Uploading..." size="text-xl"></Loading>
                  </div>
                )}
                {state === "success" && (
                  <div className="flex items-center justify-center gap-2 py-16 text-3xl font-medium text-success px-28">
                    <span className="fa-solid fa-circle-check "></span>
                    <div>{name}s Added Successfully!</div>
                  </div>
                )}
                {state === "warning" && (
                  <div className="flex flex-col items-center gap-3">
                    <h1 className="text-2xl font-bold text-success">
                      {res.data.result.nInserted} {name}s uploaded!
                    </h1>
                    <div className="flex flex-wrap items-center gap-2 text-3xl font-medium text-yellow-500 ">
                      <span className="fa-solid fa-triangle-exclamation"></span>
                      <h1 className="underline decoration-4 decoration-red-500 underline-offset-8">
                        File contains duplicate entries
                      </h1>
                    </div>

                    <div className="grid grid-cols-3 gap-4 p-4">
                      {res.data.writeErrors.map((item) => {
                        return (
                          <div
                            key={item.name}
                            className="p-3 border rounded-lg"
                          >
                            <CardInfo
                              icon={icon}
                              label="Name:"
                              value={item.op.name}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
                {state === "idle" && (
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex flex-col gap-3 px-16">
                      <div className="p-2 mb-8">
                        <PrimaryHeading name={`Add ${name}`} />
                      </div>
                      <label>
                        <input
                          type="file"
                          className="file:border-0 file:mr-7 file:py-2 file:px-6 file:rounded-full file:text-secondary hover:file:cursor-pointer hover:file:text-purple"
                          {...register("file", {
                            required: "Please choose file to upload.",
                          })}
                          accept=".xls,.xlsx,.ods"
                        />
                      </label>
                      {errors.file && (
                        <span className="flex items-center gap-2 text-red-600">
                          <span className="fa-solid fa-circle-exclamation"></span>
                          {errors.file.message}
                        </span>
                      )}
                      <h1 className="mt-4 text-lg text-mute">
                        Accepted File Format: (.xls,.xlsx,.ods)
                      </h1>

                      <div className="my-5">
                        <button
                          type="submit"
                          className="px-8 py-2.5 rounded-full bg-primary text-white"
                        >
                          SUBMIT
                        </button>
                      </div>
                    </div>
                  </form>
                )}
                {state === "error" && (
                  <div className="flex items-center justify-center gap-2 py-16 text-3xl font-medium text-red-700 px-28">
                    <span className="fa-solid fa-circle-exclamation "></span>
                    <div>Error while uploading {name}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadModal;
