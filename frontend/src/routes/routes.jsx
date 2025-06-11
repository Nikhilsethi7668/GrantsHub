import { Routes, Route } from "react-router-dom";
import Signin from "../pages/Signin";
import Dashboard from "../pages/Dashboard";

const routes = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/login" element={<Signin />} />
    </Routes>
  );
};

export default routes;
