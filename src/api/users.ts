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
import { createUserWithEmailAndPassword } from "firebase/auth";
import { authentication } from "src/api/authentication";

const addUser = async (data: User) => {
  try {
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

    return await deleteDoc(userRef);
  } catch (e) {
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
