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
import { Bike } from "src/types/bikes.types";

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

const getBikes = async () => {
  try {
    const bikeRef = collection(db, "bikes");
    return await getDocs(bikeRef);
  } catch (e) {
    console.log(e);
    return [];
  }
};

export { addBike, editBike, deleteBike, getBikes };
