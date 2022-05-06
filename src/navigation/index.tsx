import { FC } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Signup from "src/pages/authentication/Signup";
import Bikes from "src/pages/Bikes";
import Users from "src/pages/Users";
import Home from "../pages/Home";
import Login from "../pages/authentication/Login";

interface MainNavigationProps {}

const MainNavigation: FC<MainNavigationProps> = () => (
  <BrowserRouter>
    <Routes>
      <Route index element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Signup />} />
      <Route path="bikes" element={<Bikes />} />
      <Route path="users" element={<Users />} />
    </Routes>
  </BrowserRouter>
);

export default MainNavigation;
