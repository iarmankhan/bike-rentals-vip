import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { addUser, getUser } from "src/api/users";

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
      const user = await getUser(email);
      console.log({ user });
      return user;
    }

    return null;
  } catch (error) {
    console.log(error);
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
  } catch (error) {
    console.log(error);
    return null;
  }
};

export { login, register };
