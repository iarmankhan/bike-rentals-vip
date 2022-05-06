import { db } from "src/config/firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { User } from "src/types/users.types";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";

const addUser = async (data: User) => {
  try {
    const authentication = getAuth();

    const response = await createUserWithEmailAndPassword(
      authentication,
      data.email,
      data.password || ""
    );

    if (!response) {
      throw new Error("User creation failed");
    }

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
    const usersSnapshot = await getDocs(usersRef);

    if (!usersSnapshot.empty) {
      return usersSnapshot.docs.map(
        (userDoc) =>
          ({
            ...userDoc.data(),
            id: userDoc.id,
          } as User)
      );
    }

    return [];
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
