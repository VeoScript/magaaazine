import { create } from "zustand";
import * as type from '../interfaces';

export const uploadCoverStore = create<type.UploadCoverProps>((set) => ({
  previewCoverImage: null,
  imageCoverUploaded: null,
  setPreviewCoverImage: (value: any) => set(() => ({ previewCoverImage: value })),
  setImageCoverUploaded: (value: any) => set(() => ({ imageCoverUploaded: value })),
  setDefault: () =>
    set(() => ({
      previewCoverImage: null,
      imageCoverUploaded: null,
    })),
}));
