import create from "zustand";
import { StoreState } from "src/types/store.types";
import createGlobalSlice from "src/store/createGlobalSlice";

const useStore = create<StoreState>((set, get) => ({
  ...createGlobalSlice(set, get),
}));

export default useStore;
