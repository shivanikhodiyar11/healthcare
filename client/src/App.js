import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Register from "./components/Register/Register";
import Home from "./Pages/Home";
import Login from "./components/Login/Login";
import CreatePassword from "./components/Password/CreatePassword";
import Verification from "./components/Verification";
import RegenerateToken from "./components/RegenerateToken";
import ResetPassword from "./components/Password/ResetPassword";
import AboutUs from "./components/AboutUs";
import Dashboard from "./components/Dashboard";
import DisplayPatient from "./components/Dashboard/Patient/DisplayPatient";
import DisplayMedicine from "./components/Dashboard/Medicine/DisplayMedicine";
import DisplayDisease from "./components/Dashboard/Disease/DisplayDisease";
import DisplayData from "./components/Dashboard/User/DisplayData";
import { useAuth } from "./hooks/useAuth";
import PageNotFound from "./components/PageNotFound";
import ViewAllTasks from "./components/Dashboard/Patient/Task/ViewAllTasks";

function App() {
  return (
    <div className="flex flex-col min-h-screen ">
      <Header />
      <div className="flex flex-col flex-1">
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/register" element={<Register />}></Route>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          >
            <Route path=":role" element={<DisplayData />} />
            <Route path="Patient" element={<DisplayPatient />} />
            <Route path="Medicine" element={<DisplayMedicine />} />
            <Route path="Disease" element={<DisplayDisease />} />
            <Route path="Tasks" element={<ViewAllTasks />} />
          </Route>

          <Route path="/token/verify/:token" element={<Verification />}></Route>
          <Route
            path="/token/regenerate/:token"
            element={<RegenerateToken />}
          ></Route>
          <Route
            path="/set-password/:token"
            element={<CreatePassword />}
          ></Route>
          <Route path="/password-reset" element={<ResetPassword />}></Route>
          <Route path="/about-us" element={<AboutUs />}></Route>
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

const ProtectedRoute = ({ children }) => {
  const { auth } = useAuth();
  if (!auth.isAuthenticated) {
    return <Navigate to="/login" />;
  }
  return children;
};

export default App;
