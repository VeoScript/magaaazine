"use client";

import { useState, useEffect } from "react";
import { Switch } from "@headlessui/react";
import { usePathname } from "next/navigation";
import { myToast } from "../atoms/MyToast";
import Image from "next/image";
import clsx from "clsx";
import ActivityIndicator from "../atoms/ActivityIndicator";

import { useUploadThing } from "~/utils/uploadthing";

import { sendFilesStore } from "~/lib/stores/uploads/files";
import { sendImagesStore } from "~/lib/stores/uploads/images";
import { uploadImage } from "~/lib/functions/uploadImage";

import { trpc } from "~/app/_trpc/client";

interface ChatBoxProps {
  isAuth: boolean;
  hasCoverPhoto: boolean;
  receiveFilesAnonymous: boolean;
  receiveImageAnonymous: boolean;
  senderId: string;
  receiverId: string;
}

export default function ChatBox({
  isAuth,
  hasCoverPhoto,
  receiveFilesAnonymous,
  receiveImageAnonymous,
  senderId,
  receiverId,
}: ChatBoxProps) {
  const pathname = usePathname();

  const [isPendingMessage, setIsPendingMessage] = useState<boolean>(false);
  const [isPendingImage, setIsPendingImage] = useState<boolean>(false);
  const [isPendingFile, setIsPendingFile] = useState<boolean>(false);
  const [isAnonymous, setIsAnonymous] = useState<boolean>(true);
  const [messageContent, setMessageContent] = useState<string>("");

  const {
    previewImages,
    imagesUploaded,
    setPreviewImages,
    setImagesUpload,
    setDefault: setDefaultImages,
  } = sendImagesStore();

  const { files, fileUrls, setFiles, setFileUrls, setDefault: setDefaultFiles } = sendFilesStore();

  const utils = trpc.useContext();
  const sendMessageMutation = trpc.sendMessage.useMutation();
  const uploadFilesImagesMutation = trpc.uploadFilesImages.useMutation();

  // UPLOAD THE FILES TO UPLOADTHING SERVER...
  const { startUpload } = useUploadThing("mediaPost");

  const handleAddImages = (e: any): void => {
    if (previewImages.length >= 3 || e.target.files.length > 3) {
      myToast({
        type: "error",
        message: "Only up to 3 photos can be uploaded.",
      });
      return;
    }
    for (const file of e.target.files) {
      const imageTypeRegex = /image\/(png|jpg|jpeg|jfif)/gm;

      if (!file.type.match(imageTypeRegex)) {
        myToast({
          type: "error",
          message: "Please select jpg, jpeg, jfif or png only!",
        });
        return;
      }

      if (file.size > 10485760) {
        myToast({
          type: "error",
          message: "File is too large. Please select an image smaller than 10MB.",
        });
        return;
      }

      setImagesUpload(file);

      const reader = new FileReader();

      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setPreviewImages([reader.result]);
      };
      reader.onerror = () => {
        console.error(reader.error);
      };
    }
    e.target.value = null;
  };

  const handleAddFiles = (e: any): void => {
    if (files.length >= 3 || e.target.files.length > 3) {
      myToast({
        type: "error",
        message: "Only up to 3 files can be uploaded.",
      });
      return;
    }
    for (const file of e.target.files) {
      setFiles(file);
      setFileUrls(file.name);
    }
    e.target.value = null;
  };

  const deleteSingleImage = (indexToDelete: number) => {
    sendImagesStore.setState((prevState) => {
      const newPreviewImages = [...prevState.previewImages];
      const newImagesUploaded = [...prevState.imagesUploaded];

      newPreviewImages.splice(indexToDelete, 1);
      newImagesUploaded.splice(indexToDelete, 1);

      return { previewImages: newPreviewImages, imagesUploaded: newImagesUploaded };
    });
  };

  const deleteSingleFile = (indexToDelete: number) => {
    sendFilesStore.setState((prevState) => {
      const newPreviewFiles = [...prevState.fileUrls];
      const newFilesUploaded = [...prevState.files];

      newPreviewFiles.splice(indexToDelete, 1);
      newFilesUploaded.splice(indexToDelete, 1);

      return { fileUrls: newPreviewFiles, files: newFilesUploaded };
    });
  };

  const uploadImages = async () => {
    setIsPendingImage(true);
    for (const image of imagesUploaded) {
      uploadImage({
        imageFile: image,
        async onSuccessFn(result) {
          await uploadFilesImagesMutation.mutateAsync(
            {
              is_anonymous: isAnonymous,
              name: result.data.name,
              type: "IMAGE",
              url: result.data.link,
              delete_url: result.data.deletehash,
              sender_id: senderId,
              receiver_id: receiverId,
            },
            {
              onError: () => {
                setIsPendingImage(false);
              },
              onSuccess: () => {
                utils.messages.invalidate();
                setIsPendingImage(false);
                setDefaultImages();
              },
            },
          );
        },
      });
    }
  };

  const uploadFiles = async () => {
    setIsPendingFile(true);
    await startUpload(files)
      .then((result) => {
        result?.map(async (file: any) => {
          await uploadFilesImagesMutation.mutateAsync(
            {
              is_anonymous: isAnonymous,
              name: file.fileName,
              type: "FILE",
              url: file.fileUrl,
              delete_url: file.fileKey,
              sender_id: senderId,
              receiver_id: receiverId,
            },
            {
              onError: () => {
                setIsPendingFile(false);
              },
              onSuccess: () => {
                utils.messages.invalidate();
                setIsPendingFile(false);
                setDefaultFiles();
              },
            },
          );
        });
      })
      .catch((error: any) => {
        myToast({
          type: "error",
          message: error?.message,
        });
      });
  };

  const sendMessage = async () => {
    setIsPendingMessage(true);
    await sendMessageMutation.mutateAsync(
      {
        is_anonymous: isAnonymous,
        content: messageContent,
        has_file: imagesUploaded.length > 0 || files.length > 0 ? true : false,
        sender_id: senderId,
        receiver_id: receiverId,
      },
      {
        onError: () => {
          setIsPendingMessage(false);
        },
        onSuccess: () => {
          utils.messages.invalidate();
          setIsPendingMessage(false);
          setMessageContent("");
        },
      },
    );
  };

  const handleSubmit = async () => {
    if (messageContent.trim() === "")
      return myToast({
        message: "Message is required.",
      });

    if (imagesUploaded.length > 0) {
      myToast({
        type: "promise",
        buttonFunction: async () => uploadImages(),
        buttonLoadingMessage: "Uploading images...",
        buttonFunctionSuccessMessage: "Images uploaded successfully!",
        buttonFunctionErrorMessage: "Failed to upload images, try again.",
      });
    }

    if (files.length > 0) {
      myToast({
        type: "promise",
        buttonFunction: async () => uploadFiles(),
        buttonLoadingMessage: "Uploading files...",
        buttonFunctionSuccessMessage: "Files uploaded successfully!",
        buttonFunctionErrorMessage: "Failed to upload files, try again.",
      });
    }

    myToast({
      type: "promise",
      buttonFunction: async () => sendMessage(),
      buttonLoadingMessage: "Sending message...",
      buttonFunctionSuccessMessage: "Message sent successfully.",
      buttonFunctionErrorMessage: "Failed to sent message, try again.",
    });
  };

  const onEnterPress = (e: React.KeyboardEvent) => {
    if (e.keyCode == 13 && e.shiftKey == false) {
      e.preventDefault();
      handleSubmit();
    }
  };

  useEffect(() => {
    if (pathname) {
      setDefaultImages();
      setDefaultFiles();
    }
  }, [pathname, setDefaultImages, setDefaultFiles]);

  return (
    <div
      className={clsx(
        !hasCoverPhoto && "border border-neutral-300 dark:border-slate-700",
        "flex w-full flex-col items-center overflow-hidden rounded-xl",
      )}
    >
      <div
        className={clsx(
          !hasCoverPhoto && "border-b border-neutral-300 dark:border-slate-700",
          "flex w-full flex-row items-center justify-between bg-white bg-opacity-20 p-3 backdrop-blur-sm dark:bg-default-black dark:bg-opacity-50 dark:backdrop-blur-sm",
        )}
      >
        <div className="flex flex-row items-start gap-x-2">
          <Image
            className="mt-1 h-4 w-4 bg-white object-cover md:mt-0"
            src="/magaaazine.svg"
            alt="sea"
            priority
            width={10}
            height={10}
            quality={100}
          />
          <h1 className="text-sm">Send me a message</h1>
        </div>
        <div className="flex items-center gap-x-2">
          <span className="text-right text-sm">As anonymous</span>
          {!isAuth && <span className="text-2xl text-lime-400">&bull;</span>}
          {isAuth && (
            <Switch
              checked={isAnonymous}
              onChange={() => setIsAnonymous(!isAnonymous)}
              className={clsx(
                isAnonymous ? "bg-green-500" : "bg-gray-200",
                "relative inline-flex h-6 w-11 items-center rounded-full",
              )}
            >
              <span
                className={clsx(
                  isAnonymous
                    ? "translate-x-6 bg-white dark:bg-default-black"
                    : "translate-x-1 bg-green-500",
                  "inline-block h-4 w-4 transform rounded-full transition",
                )}
              />
            </Switch>
          )}
        </div>
      </div>
      <textarea
        disabled={isPendingMessage}
        autoComplete="off"
        className="h-full w-full resize-none bg-white p-3 text-black outline-none dark:bg-default-black dark:text-white"
        rows={5}
        cols={40}
        spellCheck={false}
        placeholder="Write some short message..."
        value={messageContent}
        onChange={(e) => setMessageContent(e.currentTarget.value)}
        onKeyDown={onEnterPress}
      />
      <div
        className={clsx(
          !hasCoverPhoto && "border-t border-neutral-300 dark:border-slate-700",
          "flex w-full flex-col gap-y-3 bg-white bg-opacity-20 p-3 backdrop-blur-sm dark:bg-default-black dark:bg-opacity-50 dark:backdrop-blur-sm",
        )}
      >
        <div className="flex w-full flex-row items-center justify-between gap-x-1">
          <div className="flex flex-row items-center gap-x-1">
            {receiveImageAnonymous && (
              <>
                <label
                  htmlFor="sendImage"
                  className={clsx(
                    isPendingMessage || isPendingImage || isPendingFile
                      ? "cursor-not-allowed opacity-50"
                      : "cursor-pointer",
                    "flex flex-row items-center gap-x-1 rounded-xl border border-white p-2 outline-none hover:opacity-50",
                  )}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                  <span className="text-sm">Send Image</span>
                </label>
                <input
                  disabled={isPendingMessage || isPendingImage || isPendingFile}
                  autoComplete="off"
                  multiple
                  type="file"
                  id="sendImage"
                  className="hidden"
                  onChange={handleAddImages}
                  accept=".jpg, .png, .jpeg, .jfif"
                />
              </>
            )}
            {receiveFilesAnonymous && (
              <>
                <label
                  htmlFor="sendFile"
                  className={clsx(
                    isPendingMessage || isPendingImage || isPendingFile
                      ? "cursor-not-allowed opacity-50"
                      : "cursor-pointer",
                    "flex flex-row items-center gap-x-1 rounded-xl border border-white p-2 outline-none hover:opacity-50",
                  )}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10 9 9 9 8 9" />
                  </svg>
                  <span className="text-sm">Send File</span>
                </label>
                <input
                  disabled={isPendingMessage || isPendingImage || isPendingFile}
                  autoComplete="off"
                  multiple
                  type="file"
                  id="sendFile"
                  className="hidden"
                  onChange={handleAddFiles}
                  accept=".pdf, .docx, .xlsx, .pptx"
                />
              </>
            )}
          </div>
          <button
            aria-label="Send Message"
            disabled={isPendingMessage || isPendingImage || isPendingFile}
            type="button"
            className="outline-none"
            onClick={handleSubmit}
          >
            {isPendingMessage || isPendingImage || isPendingFile ? (
              <ActivityIndicator color="#FFF" className="h-6 w-6" />
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6 hover:opacity-50"
              >
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            )}
          </button>
        </div>
        {previewImages.length != 0 && (
          <div className="flex w-full flex-wrap gap-3">
            {previewImages.map((link: any, index: number) => (
              <div
                key={link}
                className="relative flex h-[10rem] w-[10rem] overflow-hidden rounded-md"
              >
                {!isPendingImage && (
                  <button
                    type="button"
                    className="absolute right-2 top-2 z-10 rounded-full bg-black bg-opacity-50 p-1 outline-none hover:opacity-50"
                    onClick={() => deleteSingleImage(index)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="h-4 w-4 text-white"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
                <Image
                  src={link[0]}
                  className="h-full w-full object-cover"
                  alt="Image"
                  width={100}
                  height={100}
                  quality={100}
                />
              </div>
            ))}
          </div>
        )}
        {fileUrls.length != 0 && (
          <div className="flex h-full w-full flex-col gap-y-2">
            {fileUrls.map((file: any, index: number) => (
              <div
                key={file}
                className="flex w-full flex-1 flex-row items-center justify-between overflow-hidden rounded-md"
              >
                <p className="text-sm">{file}</p>
                {!isPendingFile && (
                  <button
                    type="button"
                    className="rounded-full bg-black bg-opacity-50 p-1 outline-none hover:opacity-50"
                    onClick={() => deleteSingleFile(index)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="h-4 w-4 text-white"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
