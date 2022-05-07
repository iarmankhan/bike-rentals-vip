import { GetState, SetState } from "zustand";
import { User } from "src/types/users.types";

export interface GlobalSlice {
  user: User | null;
  setUser: (user: User | null) => void;
}

export type StoreState = GlobalSlice;

export type StoreSlice<T> = (
  set: SetState<StoreState>,
  get: GetState<StoreState>
) => T;
