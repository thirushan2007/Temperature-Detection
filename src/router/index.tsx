import { Route, Routes } from "react-router-dom";
import App from "../App";

const MainRouter = () => {
  return (
    <Routes>
      <Route path="/Temperature-Detection" Component={App} />
    </Routes>
  );
};

export default MainRouter;
