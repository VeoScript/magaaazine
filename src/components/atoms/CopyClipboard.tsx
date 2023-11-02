"use client";

import { myToast } from "~/components/atoms/MyToast";

interface CopyClipboardProps {
  textToCopy: string;
}

export default function CopyClipboard({ textToCopy }: CopyClipboardProps): JSX.Element {
  const handleCopyClick = (textToCopy: string) => {
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

    // Set a state to indicate if the copy was successful
    myToast({
      type: "success",
      message: "Text copy to clipboard!",
    });
  };

  return (
    <button
      type="button"
      className="w-30 rounded-full bg-black px-3 py-1 text-[10px] outline-none hover:bg-opacity-50 md:w-20"
      onClick={() => {
        handleCopyClick(textToCopy);
      }}
    >
      Copy link
    </button>
  );
}
