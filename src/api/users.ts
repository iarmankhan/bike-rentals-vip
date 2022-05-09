import { db } from "src/config/firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentReference,
  getDoc,
  getDocs,
  limit,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { User } from "src/types/users.types";
import { getAuth } from "firebase/auth";
import { toast } from "react-toastify";
import axios from "axios";
import { apiEndpoints } from "src/constants/apiEndpoints";

const addUser = async (data: User) => {
  try {
    const token = await getAuth()?.currentUser?.getIdToken();

    const response = await axios.post(
      apiEndpoints.createUser,
      {
        email: data.email,
        password: data.password,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response || !response.data) {
      throw new Error("User creation failed");
    }

    console.log(response.data);

    const usersRef = collection(db, "users");
    return await addDoc(usersRef, {
      created: serverTimestamp(),
      ...data,
      uid: response.data.user.uid,
    });
  } catch (error: any) {
    console.log(error);
    toast.error(
      error?.response?.data?.message || error?.message || "Something went wrong"
    );
    return null;
  }
};

const editUser = async (userId: string, data: Partial<User>) => {
  try {
    const userRef = doc(db, "users", userId);
    return await updateDoc(userRef, data);
  } catch (e) {
    return null;
  }
};

const deleteUser = async (userId: string) => {
  try {
    const userRef = doc(db, "users", userId);

    const reservationsRef = collection(db, "reservations");
    const q = query(reservationsRef, where("user", "==", userRef));
    const queryDocs = await getDocs(q);

    // eslint-disable-next-line no-restricted-syntax
    for (const reservationDoc of queryDocs.docs) {
      // eslint-disable-next-line no-await-in-loop
      await deleteDoc(reservationDoc.ref);
    }

    const user = await getDoc(userRef);

    const token = await getAuth()?.currentUser?.getIdToken();

    const response = await axios.delete(apiEndpoints.deleteUser, {
      data: {
        uid: user?.data()?.uid,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response || !response.data) {
      throw new Error("User deletion failed");
    }

    await deleteDoc(userRef);
    return true;
  } catch (e: any) {
    toast.error(
      e?.response?.data?.message || e?.message || "Something went wrong"
    );
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
    return [];
  }
};

const getUser = async (email: string) => {
  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", email), limit(1));
    const queryDocs = await getDocs(q);

    if (!queryDocs.empty) {
      return {
        ...queryDocs.docs[0].data(),
        id: queryDocs.docs[0].id,
      } as User;
    }
    return null;
  } catch (e) {
    return null;
  }
};

const getUserByRef = async (userRef: DocumentReference) => {
  try {
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      return {
        ...userDoc.data(),
        id: userDoc.id,
      } as User;
    }
    return null;
  } catch (e) {
    return null;
  }
};

export { addUser, editUser, deleteUser, getUsers, getUser, getUserByRef };
