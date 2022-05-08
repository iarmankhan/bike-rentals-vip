import { FC } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Signup from "src/pages/authentication/Signup";
import Bikes from "src/pages/bikes/Bikes";
import Users from "src/pages/users/Users";
import UserReservations from "src/pages/users/UserReservations";
import BikeReservations from "src/pages/bikes/BikeReservations";
import Home from "../pages/Home";
import Login from "../pages/authentication/Login";

interface MainNavigationProps {}

const MainNavigation: FC<MainNavigationProps> = () => (
  <BrowserRouter>
    <Routes>
      <Route index element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Signup />} />
      <Route path="bikes">
        <Route index element={<Bikes />} />
        <Route path=":bikeId/reservations" element={<BikeReservations />} />
      </Route>
      <Route path="users">
        <Route index element={<Users />} />
        <Route path=":userId/reservations" element={<UserReservations />} />
      </Route>
    </Routes>
  </BrowserRouter>
);

export default MainNavigation;
