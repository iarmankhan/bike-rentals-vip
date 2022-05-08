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
  getDoc,
} from "firebase/firestore";
import { Bike, Reservation } from "src/types/bikes.types";
import { getUserByRef } from "src/api/users";

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
    const bikeRef = doc(collection(db, "bikes"), bikeId);
    const bike = await getDoc(bikeRef);

    if (!bike.exists()) {
      return { bike: null, reservations: null };
    }

    const bikeData = {
      ...bike.data(),
      id: bike.id,
    } as Bike;

    const reservationsRef = collection(db, "reservations");
    const q = query(reservationsRef, where("bike", "==", bikeRef));
    const queryDocs = await getDocs(q);

    const reservations: Reservation[] = [];

    // eslint-disable-next-line no-restricted-syntax
    for (const reservationDoc of queryDocs.docs) {
      // eslint-disable-next-line no-await-in-loop
      const user = await getUserByRef(reservationDoc.data().user);

      reservations.push({
        ...reservationDoc.data(),
        id: reservationDoc.id,
        user,
      } as Reservation);
    }

    if (!queryDocs.empty) {
      return {
        bike: bikeData,
        reservations,
      };
    }

    return { bike: bikeData, reservations: [] };
  } catch (error) {
    console.log(error);
    return { bike: null, reservations: null };
  }
};

const getUserReservations = async (userId: string) => {
  try {
    const user = doc(collection(db, "users"), userId);
    const reservationsRef = collection(db, "reservations");
    const q = query(reservationsRef, where("user", "==", user));
    const queryDocs = await getDocs(q);

    if (!queryDocs.empty) {
      return queryDocs.docs.map(
        (reservationDoc) =>
          ({
            ...reservationDoc.data(),
            id: reservationDoc.id,
          } as Reservation)
      );
    }
    return [];
  } catch (error) {
    console.log(error);
    return [];
  }
};

export {
  createReservation,
  cancelReservation,
  getBikeReservations,
  getUserReservations,
};
