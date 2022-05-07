import { useEffect } from "react";

import { onAuthStateChanged } from "firebase/auth";
import { authentication } from "src/api/authentication";
import { getUser } from "src/api/users";
import useStore from "src/store";
import { useLocation, useNavigate } from "react-router-dom";

const useIsLoggedIn = () => {
  const setUser = useStore((state) => state.setUser);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    onAuthStateChanged(authentication, async (user) => {
      if (user && user.email) {
        const { email } = user;

        const userData = await getUser(email);
        console.log(userData);

        setUser(userData);

        if (pathname === "/login" || pathname === "/register") {
          navigate("/");
        }
      } else if (pathname !== "/login" && pathname !== "/register") {
        navigate("/login");
      }
    });
  }, []);
};

export default useIsLoggedIn;
