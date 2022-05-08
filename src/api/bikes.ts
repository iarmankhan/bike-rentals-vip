import { db } from "src/config/firebase";
import {
  collection,
  addDoc,
  updateDoc,
  serverTimestamp,
  doc,
  deleteDoc,
  getDocs,
} from "firebase/firestore";
import { Bike, Reservation } from "src/types/bikes.types";
import { User } from "src/types/users.types";
import { getUserReservations } from "src/api/bike-user";

const addBike = async (data: Bike) => {
  try {
    const bikesRef = collection(db, "bikes");
    return await addDoc(bikesRef, {
      created: serverTimestamp(),
      ...data,
    });
  } catch (e) {
    console.log(e);
    return null;
  }
};

const editBike = async (bikeId: string, data: Partial<Bike>) => {
  try {
    const bikeRef = doc(db, "bikes", bikeId);
    return await updateDoc(bikeRef, data);
  } catch (e) {
    console.log(e);
    return null;
  }
};

const deleteBike = async (bikeId: string) => {
  try {
    const bikeRef = doc(db, "bikes", bikeId);
    return await deleteDoc(bikeRef);
  } catch (e) {
    console.log(e);
    return null;
  }
};

const getBikes = async (user?: User | null) => {
  try {
    const bikeRef = collection(db, "bikes");
    const bikesSnapshot = await getDocs(bikeRef);

    let reservedBikes: Reservation[] = [];
    if (user && user.role === "user" && user.id) {
      reservedBikes = await getUserReservations(user.id);
      console.log(reservedBikes);
    }

    if (!bikesSnapshot.empty) {
      return bikesSnapshot.docs.map(
        (bikeDoc) =>
          ({
            ...bikeDoc.data(),
            id: bikeDoc.id,
            isReservedByUser:
              reservedBikes.findIndex(
                (reservation) => reservation.bike.id === bikeDoc.id
              ) !== -1,
          } as Bike)
      );
    }

    return [];
  } catch (e) {
    console.log(e);
    return [];
  }
};

export { addBike, editBike, deleteBike, getBikes };
