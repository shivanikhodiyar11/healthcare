import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import NoDataFound from "../../NoDataFound";
import PrimaryHeading from "../../PrimaryHeading";
import AddUserModal from "./AddUserModal";
import CardInfo from "../CardInfo";
import DeleteModal from "../DeleteModal";
import EditUserModal from "./EditUserModal";
import SearchFilter from "../SearchFilter";
import Unauthorized from "../../Unauthorized";
import PageNotFound from "../../PageNotFound";

const DisplayData = () => {
  const [res, setRes] = useState();
  const [fetching, setFetching] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(8);
  const [state, setState] = useState("idle");

  const pages = () => {
    if (res)
      return Array.from(
        { length: Math.ceil(res.count / res.limit) },
        (_, i) => i + 1
      );
  };

  const { role } = useParams();
  const { auth } = useAuth();

  const getUsers = useCallback(() => {
    setFetching(true);
    axios
      .get(`${process.env.REACT_APP_PATH_NAME}/user`, {
        headers: { authorization: auth.token },
        params: { role, page, limit, search },
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
  }, [auth.token, role, page, limit, search]);

  const approveUsers = (id) => {
    axios
      .put(`${process.env.REACT_APP_PATH_NAME}/user/approve/${id}`, undefined, {
        headers: { authorization: auth.token },
      })
      .then((res) => {
        getUsers();
      })
      .catch((error) => {
        alert(error.response.data);
      });
  };

  useEffect(() => {
    if (!["Nurse", "Doctor", "Pharmacist"].includes(role)) return;
    getUsers();
  }, [getUsers, role]);

  if (!["Nurse", "Doctor", "Pharmacist"].includes(role)) {
    return <PageNotFound />;
  }
  return (
    <div className="flex flex-col flex-1 mr-20">
      <div className="flex items-center justify-between p-5">
        <PrimaryHeading name={`${role}s`} />
        <div className="flex items-center gap-4">
          <SearchFilter
            onChange={setSearch}
            placeholder="Search for name & email ..."
          />
          <AddUserModal onAdd={getUsers} />
        </div>
      </div>
      {/* <div className="flex items-center gap-1 px-5">
        <span className="fa-solid fa-arrow-down-a-z"></span>
        <label htmlFor="sortby" className="text-secondary">
          Sort By:
        </label>
        <select
          id="sortby"
          className="p-2 bg-white border focus:outline-none"
          defaultValue={"DEFAULT"}
        >
          <option value="DEFAULT" disabled>
            Select Fields To Sort
          </option>
          <option value="first_name">First Name</option>
          <option value="last_name">Last Name</option>
        </select>
      </div> */}
      {state === "unauthorized" && <Unauthorized />}
      {state === "error" ? (
        <NoDataFound />
      ) : (
        <div className="relative grid flex-1 p-3 lg:grid-cols-4 lg:grid-rows-2 md:grid-cols-2 gap-x-1 gap-y-6">
          {fetching && (
            <div className="absolute inset-0 z-50 flex items-center justify-center text-3xl bg-white ">
              <span className="fa-solid fa-hurricane fa-spin"></span>
            </div>
          )}

          {res &&
            res.users.map((item) => {
              return (
                <div
                  className="mx-2 duration-700 bg-white rounded-lg shadow-xl hover:shadow-purple"
                  key={item.updatedAt}
                >
                  <div className="h-32 overflow-hidden bg-gray-300 rounded-t-lg "></div>
                  <div className="relative w-32 h-32 mx-auto -mt-16 overflow-hidden border-8 border-white rounded-full">
                    <img
                      className="object-cover object-center h-32 bg-purple"
                      src={`/images/${item.role}.png`}
                      alt="profile.png"
                    />
                  </div>

                  <div className="gap-2 p-4 columns-1">
                    <CardInfo label="First Name:" value={item.first_name} />
                    <CardInfo label="Last Name:" value={item.last_name} />
                    <CardInfo label="Email:" value={item.email} />
                    <CardInfo label="Contact No:" value={item.phoneNo} />
                    <CardInfo label="Gender:" value={item.gender} />
                  </div>
                  <div className="flex justify-between p-3 mt-2 border-t">
                    {item.isApproved === false && (
                      <div>
                        <button
                          className="px-3 py-2 text-white rounded-md bg-success"
                          onClick={() => {
                            approveUsers(item._id);
                          }}
                        >
                          Approve {item.role}
                        </button>
                      </div>
                    )}
                    <div className="flex gap-3">
                      <EditUserModal details={item} onUpdate={getUsers} />
                      <DeleteModal
                        details={item}
                        onDelete={getUsers}
                        path="user/delete"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      )}
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
                    className="px-2 rounded-full bg-slate-300 focus:bg-primary"
                    onClick={() => setPage(p)}
                  >
                    {p}
                  </button>
                </div>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-secondary">Limit:</h1>
            <select
              className="w-full px-3 py-1 bg-white"
              onChange={(e) => {
                setLimit(e.target.value);
              }}
            >
              <option value="8">8 Cards</option>
              <option value="12">12 Cards</option>
              <option value="16">16 Cards</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export default DisplayData;
