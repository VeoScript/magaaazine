import { create } from "zustand";
import * as type from '../interfaces';

export const uploadProfileStore = create<type.UploadProfileProps>((set) => ({
  previewProfileImage: null,
  imageProfileUploaded: null,
  setPreviewProfileImage: (value: any) => set(() => ({ previewProfileImage: value })),
  setImageProfileUploaded: (value: any) => set(() => ({ imageProfileUploaded: value })),
  setDefault: () =>
    set(() => ({
      imageProfileUploaded: null,
      previewProfileImage: null,
    })),
}));
