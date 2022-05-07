import { GlobalSlice, StoreSlice } from "src/types/store.types";

const createGlobalSlice: StoreSlice<GlobalSlice> = (set) => ({
  user: null,
  setUser: (user) => {
    set({ user });
  },
});

export default createGlobalSlice;
