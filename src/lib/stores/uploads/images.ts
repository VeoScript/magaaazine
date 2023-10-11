import { create } from "zustand";
import * as type from "../interfaces";

export const sendImagesStore = create<type.SendMessageImagesProps>((set) => ({
  previewImages: [],
  imagesUploaded: [],
  setPreviewImages: (value: any[]) =>
    set((state) => ({ previewImages: [...state.previewImages, value] })),
  setImagesUpload: (value: any[]) =>
    set((state) => ({ imagesUploaded: [...state.imagesUploaded, value] })),
  setDefault: () =>
    set(() => ({
      previewImages: [],
      imagesUploaded: [],
    })),
}));
