import { db } from "src/config/firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentReference,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { Bike, Reservation } from "src/types/bikes.types";
import { User } from "src/types/users.types";
import { getUserReservations } from "src/api/bike-user";
import { toast } from "react-toastify";

const addBike = async (data: Bike) => {
  try {
    const bikesRef = collection(db, "bikes");
    return await addDoc(bikesRef, {
      created: serverTimestamp(),
      ...data,
    });
  } catch (e) {
    return null;
  }
};

const editBike = async (bikeId: string, data: Partial<Bike>) => {
  try {
    const bikeRef = doc(db, "bikes", bikeId);
    return await updateDoc(bikeRef, data);
  } catch (e) {
    return null;
  }
};

const deleteBike = async (bikeId: string) => {
  try {
    const bikeRef = doc(db, "bikes", bikeId);
    const reservationsRef = collection(db, "reservations");
    const q = query(reservationsRef, where("bike", "==", bikeRef));
    const queryDocs = await getDocs(q);

    // eslint-disable-next-line no-restricted-syntax
    for (const reservationDoc of queryDocs.docs) {
      // eslint-disable-next-line no-await-in-loop
      await deleteDoc(reservationDoc.ref);
    }
    await deleteDoc(bikeRef);
    return true;
  } catch (e: any) {
    toast.error(e?.message || "Something went wrong");
    return null;
  }
};

const getBikes = async (user?: User | null) => {
  try {
    const bikeRef = collection(db, "bikes");
    const bikesSnapshot = await getDocs(bikeRef);

    let reservedBikes: Reservation[] = [];
    if (user && user.role === "user" && user.id) {
      const response = await getUserReservations(user.id);
      reservedBikes = response.reservations || [];
    }

    if (!bikesSnapshot.empty) {
      const bikes: Bike[] = [];
      // eslint-disable-next-line no-restricted-syntax
      for (const bikeDoc of bikesSnapshot.docs) {
        const reservationsRef = collection(db, "reservations");
        const q = query(reservationsRef, where("bike", "==", bikeDoc.ref));

        // eslint-disable-next-line no-await-in-loop
        const queryDocs = await getDocs(q);
        const reservations = queryDocs.docs.map((reservationDoc) => ({
          ...reservationDoc.data(),
          id: reservationDoc.id,
        }));

        bikes.push({
          ...bikeDoc.data(),
          id: bikeDoc.id,
          isReservedByUser:
            reservedBikes.findIndex(
              (reservation) => reservation.bike.id === bikeDoc.id
            ) !== -1,
          reservations,
        } as Bike);
      }

      return bikes;
    }

    return [];
  } catch (e) {
    return [];
  }
};

const getBikeByRef = async (bikeRef: DocumentReference) => {
  try {
    const bikeDoc = await getDoc(bikeRef);

    if (bikeDoc.exists()) {
      return {
        ...bikeDoc.data(),
        id: bikeDoc.id,
      } as Bike;
    }
    return null;
  } catch (e) {
    return null;
  }
};

export { addBike, editBike, deleteBike, getBikes, getBikeByRef };
