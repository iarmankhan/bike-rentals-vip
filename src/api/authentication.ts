import {
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  getAuth,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { addUser, getUser } from "src/api/users";
import { toast } from "react-toastify";

export const authentication = getAuth();

const login = async (email: string, password: string) => {
  try {
    await setPersistence(authentication, browserLocalPersistence);
    const response = await signInWithEmailAndPassword(
      authentication,
      email,
      password
    );

    if (response) {
      sessionStorage.setItem("Auth Token", response.user.refreshToken);
      return await getUser(email);
    }

    return null;
  } catch (error: any) {
    if (error.code === "auth/user-not-found") {
      toast.error("User not found");
    } else if (error.code === "auth/wrong-password") {
      toast.error("Wrong password");
    } else {
      toast.error("Something went wrong");
    }
    return null;
  }
};

const register = async (email: string, password: string, role: string) => {
  try {
    const response = await createUserWithEmailAndPassword(
      authentication,
      email,
      password
    );

    if (response) {
      sessionStorage.setItem("Auth Token", response.user.refreshToken);

      return await addUser({
        name: email,
        role: role as any,
        email,
      });
    }

    return null;
  } catch (error: any) {
    if (error.code === "auth/email-already-in-use") {
      toast.error("Email already in use");
    } else {
      toast.error("Something went wrong");
    }
    return null;
  }
};

const logout = async () => {
  try {
    return await signOut(authentication);
  } catch (error) {
    return null;
  }
};

export { login, register, logout };
