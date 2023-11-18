"use client";

import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import clsx from "clsx";
import ActivityIndicator from "~/components/atoms/ActivityIndicator";

import { trpc } from "~/app/_trpc/client";
import { myToast } from "~/components/atoms/MyToast";
import { uploadProfileStore } from "~/lib/stores/uploads/profile";
import { uploadImage } from "~/lib/functions/uploadImage";

interface ProfileUploadProps {
  profileId: string;
}

interface PreviewProfileImageProps {
  imageUrl: string;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

export default function ProfileUpload({ profileId }: ProfileUploadProps) {
  const { data: user, isLoading: isLoadingUser } = trpc.user.useQuery(undefined, {
    cacheTime: 0,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });

  const { previewProfileImage, setImageProfileUploaded, setPreviewProfileImage } =
    uploadProfileStore();

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleUpdateProfileImage = (e: any) => {
    try {
      setImageProfileUploaded(e.target.files[0]);

      var file = e.target.files[0];
      var reader = new FileReader();
      var allowedExtensions = /(\.jpg|\.jpeg|\.jfif|\.png)$/i;

      if (e.target.value !== "" && !allowedExtensions.exec(e.target.value)) {
        e.target.value = "";
        setImageProfileUploaded("");
        myToast({
          type: "error",
          message: "Please select jpg, jpeg or png only!",
        });
        return;
      }

      if (e.target.files[0].size > 2097152) {
        setImageProfileUploaded("");
        setPreviewProfileImage("");
        myToast({
          type: "error",
          message: "Selected photo size exceeds 2 MB. Choose another one.",
        });
        return;
      }

      reader.onloadend = function () {
        setPreviewProfileImage(reader.result);
        setIsOpen(true);
      };

      if (file) {
        reader.readAsDataURL(file);
      } else {
        setPreviewProfileImage("");
      }

      e.target.value = null;
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {isLoadingUser ? (
        <div className="absolute bottom-3 right-3 cursor-pointer rounded-full bg-black bg-opacity-50 p-2 outline-none hover:opacity-50">
          <ActivityIndicator color="#FFF" className="h-5 w-5 text-white" />
        </div>
      ) : (
        <>
          {user?.id === profileId && (
            <>
              <label
                htmlFor="uploadProfile"
                className="absolute bottom-3 right-3 cursor-pointer rounded-full bg-black bg-opacity-50 p-2 outline-none hover:opacity-50"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-5 w-5 text-white"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z"
                  />
                </svg>
              </label>
              <input
                type="file"
                id="uploadProfile"
                className="hidden"
                onChange={handleUpdateProfileImage}
                accept=".jpg, .png, .jpeg, .jfif"
              />
              <PreviewProfileImage
                imageUrl={previewProfileImage}
                isOpen={isOpen}
                setIsOpen={setIsOpen}
              />
            </>
          )}
        </>
      )}
    </>
  );
}

function PreviewProfileImage({ imageUrl, isOpen, setIsOpen }: PreviewProfileImageProps) {
  "use client";

  const router = useRouter();

  const { imageProfileUploaded } = uploadProfileStore();

  const utils = trpc.useContext();
  const uploadProfileMutation = trpc.uploadProfile.useMutation();

  const [isPending, setIsPending] = useState<boolean>(false);

  const handleUpdateProfile = async () => {
    setIsPending(true);

    uploadImage({
      imageFile: imageProfileUploaded,
      async onSuccessFn(result) {
        await uploadProfileMutation.mutateAsync(
          {
            profileUrl: result.data.link,
          },
          {
            onSuccess: () => {
              myToast({
                type: "success",
                message: "Profile photo is updated, just wait for a moment to see the changes.",
              });
              utils.profile.invalidate();
              utils.user.invalidate();
              utils.users.invalidate();
              router.refresh();
              setIsPending(false);
              setIsOpen(false);
            },
            onError: (error) => {
              setIsPending(false);
              myToast({
                type: "error",
                message: error.message,
              });
            },
          },
        );
      },
    });
  };

  return (
    <Dialog open={isOpen} onClose={() => !isPending && setIsOpen(false)} className="relative z-50">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" aria-hidden="true" />
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <Dialog.Panel className="mx-auto flex h-auto w-full max-w-sm flex-col gap-y-5 rounded-lg bg-white p-5 text-black dark:bg-default-black dark:text-white">
          <div className="flex w-full flex-row items-center justify-between">
            <p>Change Profile</p>
            {!isPending && (
              <button
                type="button"
                className="outline-none hover:opacity-50"
                onClick={() => setIsOpen(false)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-5 w-5"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          <div className="flex w-full flex-col items-center gap-y-3">
            <Image
              className="h-[13rem] w-[13rem] rounded-full object-cover"
              src={imageUrl}
              alt="profile-image"
              width={500}
              height={500}
              quality={100}
              placeholder="blur"
              blurDataURL={imageUrl}
            />
            <p className="text-xs">This will be the actual size of your profile photo.</p>
          </div>
          <div className="items center flex w-full flex-row gap-x-2">
            <button
              disabled={isPending}
              type="button"
              className={clsx(
                isPending && "cursor-not-allowed",
                "custom-button w-full outline-none",
              )}
              onClick={handleUpdateProfile}
            >
              {isPending ? "Saving..." : "Save"}
            </button>
            {!isPending && (
              <button
                type="button"
                className="custom-button-outlined w-full outline-none"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </button>
            )}
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
