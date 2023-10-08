import { create } from "zustand";
import * as type from "./interfaces";

export const authStore = create<type.AuthStoreProps>((set) => ({
  isAuth: false,
  setIsAuth: (value: boolean) => set(() => ({ isAuth: value })),
}));
