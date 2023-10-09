export interface AuthStoreProps {
  isAuth: boolean;
  setIsAuth: (value: boolean) => void;
}

export interface UploadProfileProps {
  previewProfileImage: any;
  imageProfileUploaded: any;
  setPreviewProfileImage: (value: any) => void;
  setImageProfileUploaded: (value: any) => void;
  setDefault: () => void;
}
