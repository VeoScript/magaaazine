"use client";

import { useState } from "react";
import { myToast } from "~/components/atoms/MyToast";

import ActivityIndicator from "./ActivityIndicator";

interface CopyClipboardProps {
  textToCopy: string;
}

export default function CopyClipboard({ textToCopy }: CopyClipboardProps): JSX.Element {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isShowDone, setIsShowDone] = useState<boolean>(false);

  const handleCopyClick = (textToCopy: string): void => {
    setIsLoading(true);
    setTimeout(() => {
      // Create a new text area element
      const textArea = document.createElement("textarea");
      textArea.value = textToCopy;

      // Append the text area to the DOM
      document.body.appendChild(textArea);

      // Select the text within the text area
      textArea.select();

      // Attempt to copy the selected text to the clipboard
      document.execCommand("copy");

      // Remove the text area from the DOM
      document.body.removeChild(textArea);

      setIsLoading(false);
      setIsShowDone(true);

      // Set a state to indicate if the copy was successful
      myToast({
        type: "success",
        message: "Text copy to clipboard!",
      });
    }, 3000);
  };

  return (
    <>
      {isLoading ? (
        <ActivityIndicator className="h-6 w-6 text-red-500" />
      ) : (
        <>
          {isShowDone ? (
            <div className="relative flex h-6 w-6 flex-row items-center justify-center">
              <span className="absolute h-3 w-3 rounded-full bg-white" />
              <svg
                fill="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                className="absolute h-full w-full text-lime-600"
              >
                <path
                  clipRule="evenodd"
                  fillRule="evenodd"
                  d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                />
              </svg>
            </div>
          ) : (
            <button
              type="button"
              className="w-30 rounded-full bg-black px-3 py-1 text-[10px] outline-none hover:bg-opacity-50 md:w-[8rem] md:py-2 md:text-xs"
              onClick={() => {
                handleCopyClick(textToCopy);
              }}
            >
              Copy link
            </button>
          )}
        </>
      )}
    </>
  );
}
