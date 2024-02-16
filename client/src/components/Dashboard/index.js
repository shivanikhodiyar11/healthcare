import { Outlet } from "react-router-dom";
import LeftBar from "./LeftBar";

const Dashboard = () => {
  return (
    <div className="flex flex-col flex-1 mb-3 lg:flex-row">
      <div className="p-3 border-r-2 border-dashed lg:w-1/5 border-primary">
        <LeftBar />
      </div>

      <Outlet />
    </div>
  );
};

export default Dashboard;
