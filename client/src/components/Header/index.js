import React from "react";
import { Link } from "react-router-dom";
import HeaderLinks from "./HeaderLinks";

import PrimaryButton from "./PrimaryButton";
import { useAuth } from "../../hooks/useAuth";
import Logo from "../Logo";

const Header = () => {
  const { auth, dispatch } = useAuth();

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md shadow-slate-200">
      <div className="container flex items-center justify-between p-2">
        <Logo />
        <div className="flex items-center gap-8">
          <div className="flex gap-6">
            <HeaderLinks />
          </div>

          <div>
            {auth.isAuthenticated ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 p-2 text-white rounded-md bg-purple">
                  <img
                    src={`/images/${auth.user.role}.png`}
                    alt={auth.user.role}
                    className="w-8 h-8"
                  />

                  {/* <span className="fa-solid fa-user-tie"></span> */}
                  <h1 className="text-lg font-medium">
                    Welcome, {auth.user.first_name}
                  </h1>
                </div>

                <Link to="/">
                  <button
                    className="flex items-center gap-1 px-6 py-2 text-lg font-medium leading-tight transition duration-300 border-2 rounded text-secondary border-secondary hover:bg-secondary hover:text-white hover:border-primary"
                    onClick={() => {
                      dispatch({ type: "loggedOut" });
                    }}
                  >
                    Logout
                    <span className="fa-solid fa-person-walking-arrow-right"></span>
                  </button>
                </Link>
              </div>
            ) : (
              <div className="flex gap-3">
                <PrimaryButton link={"/login"} name="Login" />
                <PrimaryButton link={"/register"} name="SignUp" />
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
