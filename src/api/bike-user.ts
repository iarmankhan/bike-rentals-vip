import { db } from "src/config/firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";

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

export { createReservation, cancelReservation };
