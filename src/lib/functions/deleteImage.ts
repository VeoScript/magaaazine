"use client";

import { myToast } from "~/components/atoms/MyToast";

interface DeleteImageProps {
  deleteHash: string;
  onSuccessFn?: (result: any) => void;
}

export async function deleteImage({ deleteHash, onSuccessFn }: DeleteImageProps): Promise<void> {
  return await fetch(`https://api.imgur.com/3/image/${deleteHash}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${process.env.IMGUR_API_KEY}`,
    },
  })
    .then((response) => response.json())
    .then(async (result) => {
      if (onSuccessFn) {
        onSuccessFn(result);
      }
    })
    .catch(() => {
      myToast({
        type: "error",
        message: "Delete image failed, try again.",
      });
    });
}
