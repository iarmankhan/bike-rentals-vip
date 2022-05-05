import { db } from "src/config/firebase";
import {
  collection,
  addDoc,
  updateDoc,
  serverTimestamp,
  doc,
  deleteDoc,
  getDocs,
  query,
  where,
  limit,
} from "firebase/firestore";
import { User } from "src/types/users.types";

const addUser = async (data: User) => {
  try {
    const usersRef = collection(db, "users");
    return await addDoc(usersRef, {
      created: serverTimestamp(),
      ...data,
    });
  } catch (e) {
    console.log(e);
    return null;
  }
};

const editUser = async (userId: string, data: Partial<User>) => {
  try {
    const userRef = doc(db, "users", userId);
    return await updateDoc(userRef, data);
  } catch (e) {
    console.log(e);
    return null;
  }
};

const deleteUser = async (userId: string) => {
  try {
    const userRef = doc(db, "users", userId);
    return await deleteDoc(userRef);
  } catch (e) {
    console.log(e);
    return null;
  }
};

const getUsers = async () => {
  try {
    const usersRef = collection(db, "users");
    return await getDocs(usersRef);
  } catch (e) {
    console.log(e);
    return [];
  }
};

const getUser = async (email: string) => {
  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", email), limit(1));
    const queryDocs = await getDocs(q);

    if (!queryDocs.empty) {
      return queryDocs.docs[0].data();
    }
    return null;
  } catch (e) {
    console.log(e);
    return null;
  }
};

export { addUser, editUser, deleteUser, getUsers, getUser };