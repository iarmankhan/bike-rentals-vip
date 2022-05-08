import { db } from "src/config/firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { Reservation } from "src/types/bikes.types";

const createReservation = async (
  bikeId: string,
  userId: string,
  startDate: Date,
  endDate: Date
) => {
  try {
    const usersRef = collection(db, "users");
    const user = doc(usersRef, userId);

    const bikesRef = collection(db, "bikes");
    const bike = doc(bikesRef, bikeId);

    const reservationsRef = collection(db, "reservations");
    return await addDoc(reservationsRef, {
      bike,
      user,
      startDate,
      endDate,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.log(error);

    return null;
  }
};

const cancelReservation = async (reservationId: string) => {
  try {
    const reservationsRef = collection(db, "reservations");
    const reservation = doc(reservationsRef, reservationId);

    return await deleteDoc(reservation);
  } catch (error) {
    console.log(error);
    return null;
  }
};

const getBikeReservations = async (bikeId: string) => {
  try {
    const bike = doc(collection(db, "bikes"), bikeId);
    const reservationsRef = collection(db, "reservations");
    const q = query(reservationsRef, where("bike", "==", bike));
    const queryDocs = await getDocs(q);

    if (!queryDocs.empty) {
      return {
        ...queryDocs.docs[0].data(),
        id: queryDocs.docs[0].id,
      } as Reservation;
    }
    return [];
  } catch (error) {
    console.log(error);
    return [];
  }
};

export { createReservation, cancelReservation, getBikeReservations };
