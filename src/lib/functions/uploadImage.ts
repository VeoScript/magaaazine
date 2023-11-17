"use client";

import { myToast } from "~/components/atoms/MyToast";

interface UploadImageProps {
  imageFile: any;
  onSuccessFn: (result: any) => Promise<void>;
}

export async function uploadImage({ imageFile, onSuccessFn }: UploadImageProps): Promise<void> {
  const profilePhoto = new FormData();
  profilePhoto.append("image", imageFile);
  profilePhoto.append("name", imageFile.name);

  return await fetch("https://api.imgur.com/3/image", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.IMGUR_API_KEY}`,
    },
    body: profilePhoto,
  })
    .then((response) => response.json())
    .then(async (result) => {
      await onSuccessFn(result);
    })
    .catch(() => {
      myToast({
        type: "error",
        message: "Upload image failed, try again.",
      });
    });
};

export async function uploadImageImgbb({ imageFile, onSuccessFn }: UploadImageProps): Promise<void> {
  const profilePhoto = new FormData();
  profilePhoto.append("image", imageFile);

  return await fetch(`https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`, {
    method: "POST",
    body: profilePhoto,
  })
    .then((response) => response.json())
    .then(async (result) => {
      await onSuccessFn(result);
    })
    .catch(() => {
      myToast({
        type: "error",
        message: "Upload image failed, try again.",
      });
    });
};
