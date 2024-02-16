import {
  useContext,
  useReducer,
  createContext,
  useEffect,
  useMemo,
} from "react";

// Auth Store
const initialState = () => {
  if (!localStorage.getItem("auth")) return { isAuthenticated: false };
  return JSON.parse(localStorage.getItem("auth"));
};

function authReducer(state, action) {
  switch (action.type) {
    case "loggedIn":
      return { isAuthenticated: true, ...action.payload };

    case "loggedOut":
      return { isAuthenticated: false };

    default:
      throw new Error("Unknown action: ", action.type);
  }
}

// Create auth context
const authContext = createContext();
// Provider
export function AuthProvider({ children }) {
  const [auth, dispatch] = useReducer(authReducer, initialState());

  useEffect(() => {
    localStorage.setItem("auth", JSON.stringify(auth));
  }, [auth]);

  const value = useMemo(
    () => ({
      auth,
      dispatch,
    }),
    [auth, dispatch]
  );

  return <authContext.Provider value={value}>{children}</authContext.Provider>;
}

export const useAuth = () => useContext(authContext);
