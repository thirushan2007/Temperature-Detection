import { Route, Routes } from "react-router-dom";
import HomePage from "../pages/homepage";

const MainRouter = () => {
  return (
    <Routes>
      <Route path="/Temperature-Detection" Component={HomePage} />
    </Routes>
  );
};

export default MainRouter;
