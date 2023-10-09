"use client";

import { useState } from "react";
import { Switch } from "@headlessui/react";
import clsx from "clsx";

interface ChatBoxProps {
  isAuth: boolean;
  hasCoverPhoto: boolean;
  receiveFilesAnonymous: boolean;
  receiveImageAnonymous: boolean;
  senderId: string;
  receiverId: string;
}

export default function ChatBox({ isAuth, hasCoverPhoto }: ChatBoxProps) {
  const [isPending, setIsPending] = useState<boolean>(false);
  const [isAnonymous, setIsAnonymous] = useState<boolean>(true);
  const [messageContent, setMessageContent] = useState<string>("");

  return (
    <div
      className={clsx(
        !hasCoverPhoto && "border border-neutral-300",
        "flex w-full flex-col items-center overflow-hidden rounded-xl",
      )}
      data-aos="fade-up"
      data-aos-delay="600"
    >
      <div
        className={clsx(
          !hasCoverPhoto && "border-b border-neutral-300",
          "flex w-full flex-row items-center justify-between bg-white bg-opacity-20 p-3 backdrop-blur-sm",
        )}
      >
        <h1 className="text-xs">Send me a message! 🤗</h1>
        <div className="flex items-center gap-x-2">
          <span className="text-xs font-light">As anonymous</span>
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
                  isAnonymous ? "translate-x-6 bg-white" : "translate-x-1 bg-green-500",
                  "inline-block h-4 w-4 transform rounded-full transition",
                )}
              />
            </Switch>
          )}
        </div>
      </div>
      <textarea
        disabled={isPending}
        className="h-full w-full resize-none bg-white p-3 text-sm text-black outline-none"
        rows={5}
        cols={40}
        spellCheck={false}
        placeholder="Write some short message..."
        value={messageContent}
        onChange={(e) => setMessageContent(e.currentTarget.value)}
        // onKeyDown={onEnterPress}
      />
      <div
        className={clsx(
          !hasCoverPhoto && "border-t border-neutral-300",
          "flex w-full flex-col gap-y-3 bg-white bg-opacity-20 p-3 backdrop-blur-sm",
        )}
      >
        <div className="flex w-full flex-row items-center justify-between gap-x-1">
          <div className="flex flex-row items-center gap-x-1">
            {true && (
              <>
                <label
                  htmlFor="sendImage"
                  className="flex cursor-pointer flex-row items-center gap-x-1 rounded-xl border border-neutral-400 p-2 outline-none hover:opacity-50"
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
                  <span className="text-xs font-light">Send Image</span>
                </label>
                <input
                  disabled={isPending}
                  multiple
                  type="file"
                  id="sendImage"
                  className="hidden"
                  // onChange={handleAddImages}
                  accept=".jpg, .png, .jpeg, .jfif"
                />
              </>
            )}
            {true && (
              <>
                <label
                  htmlFor="sendFile"
                  className="flex cursor-pointer flex-row items-center gap-x-1 rounded-xl border border-neutral-400 p-2 outline-none hover:opacity-50"
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
                  <span className="text-xs font-light">Send File</span>
                </label>
                <input
                  disabled={isPending}
                  multiple
                  type="file"
                  id="sendFile"
                  className="hidden"
                  // onChange={handleAddFiles}
                  accept=".pdf, .docx, .xlsx, .pptx"
                />
              </>
            )}
          </div>
          <button
            data-tooltip-id="onlyself-tooltip"
            data-tooltip-content="Send Message"
            disabled={isPending}
            type="button"
            className="outline-none"
            // onClick={handleSendMessage}
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
              className="h-6 w-6 hover:opacity-50"
            >
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
        {/* {previewImages.length != 0 && (
          <div className="flex w-full flex-wrap gap-3">
            {previewImages.map((link: any, index: number) => (
              <div
                key={link}
                className="relative flex h-[10rem] w-[10rem] overflow-hidden rounded-md"
              >
                {!isPending && (
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
                      className="h-4 w-4"
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
        )} */}
        {/* {fileUrls.length != 0 && (
          <div className="flex h-full w-full flex-col gap-y-2">
            {fileUrls.map((file: any, index: number) => (
              <div
                key={file}
                className="flex w-full flex-1 flex-row items-center justify-between overflow-hidden rounded-md"
              >
                <p className="text-sm">{file}</p>
                {!isPending && (
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
                      className="h-4 w-4"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>
        )} */}
      </div>
    </div>
  );
}
