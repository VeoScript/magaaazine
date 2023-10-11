import { create } from "zustand";
import * as type from "../interfaces";

export const sendFilesStore = create<type.SendMessageFilesProps>((set) => ({
  files: [],
  fileUrls: [],
  setFiles: (value: any) => set((state) => ({ files: [...state.files, value] })),
  setFileUrls: (value: any) => set((state) => ({ fileUrls: [...state.fileUrls, value] })),
  setDefault: () =>
    set(() => ({
      files: [],
      fileUrls: [],
    })),
}));
