import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { useAuth } from "../../../../hooks/useAuth";
import NoDataFound from "../../../NoDataFound";
import PrimaryHeading from "../../../PrimaryHeading";
import Unauthorized from "../../../Unauthorized";
import CardInfo from "../../CardInfo";
import DeleteModal from "../../DeleteModal";

const ViewAllTasks = () => {
  const [fetching, setFetching] = useState(true);
  const { auth } = useAuth();
  const [res, setRes] = useState();
  const [state, setState] = useState("idle");
  //   const [search, setSearch] = useState();

  const getTasks = useCallback(() => {
    setFetching(true);
    axios
      .get(`${process.env.REACT_APP_PATH_NAME}/nurse-task`, {
        headers: { authorization: auth.token },
        // params: { role, page, limit, search },
      })
      .then((res) => {
        setRes(res.data);
        setState("idle");
      })
      .catch((error) => {
        if (error.response.status === 404) {
          setState("error");
        } else if (error.response.status === 401) {
          setState("unauthorized");
        }
        setRes(null);
        console.log(error);
      })
      .finally(() => {
        setFetching(false);
      });
  }, [auth.token]);
  console.log(res);
  useEffect(() => {
    getTasks();
  }, [getTasks]);

  return (
    <div className="flex flex-col flex-1 mr-20">
      <div className="flex items-center justify-between p-5">
        <PrimaryHeading name="Tasks" />
        <div className="flex items-center gap-4">
          {/* <SearchFilter
            onChange={setSearch}
            placeholder="Search for medicine name ..."
          /> */}
        </div>
      </div>
      {state === "unauthorized" && <Unauthorized />}
      {state === "error" ? (
        <NoDataFound />
      ) : (
        <div className="relative grid flex-1 grid-cols-3 grid-rows-2 gap-3 p-3">
          {fetching && (
            <div className="absolute inset-0 z-50 flex items-center justify-center text-3xl bg-white ">
              <span className="fa-solid fa-hurricane fa-spin"></span>
            </div>
          )}

          {res &&
            res.map((item) => {
              return (
                <div
                  className="p-3 mx-4 text-lg duration-700 rounded-lg shadow-md bg-slate-50/75 hover:shadow-purple"
                  key={item.updatedAt}
                >
                  <CardInfo label="Patient Name:" value={item.patient.name} />
                  <CardInfo label="Email:" value={item.patient.email} />
                  <CardInfo
                    label="Blood Pressure:"
                    value={item.patient.bloodPressure}
                  />
                  <CardInfo label="Task-Title:" value={item.taskTitle} />
                  <CardInfo label="Description:" value={item.taskDescription} />
                  <CardInfo label="Status:" value={item.status} />
                  <div className="flex justify-end gap-3 p-3">
                    {/* <EditTaskModal detail={item} onUpdate={getTasks} /> */}
                    <DeleteModal
                      details={item}
                      onDelete={getTasks}
                      path="nurse-task/delete"
                    />
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
};

export default ViewAllTasks;
