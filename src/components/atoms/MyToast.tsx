"use client";

import toast from "react-hot-toast";

interface MyToastProps {
  type?: "success" | "error" | "promise" | null;
  message?: string | null;
  buttonFunction?: () => Promise<void>;
  buttonLoadingMessage?: string;
  buttonFunctionSuccessMessage?: string;
  buttonFunctionErrorMessage?: string;
}

export function myToast({
  type,
  message,
  buttonFunction,
  buttonLoadingMessage,
  buttonFunctionSuccessMessage,
  buttonFunctionErrorMessage,
}: MyToastProps) {
  switch (type) {
    case "success":
      if (message) {
        return toast.success(message, {
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
      }
    case "error":
      if (message) {
        return toast.error(message, {
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
      }
    case "promise":
      if (buttonFunction) {
        return toast.promise(
          buttonFunction(),
          {
            loading: buttonLoadingMessage ?? '',
            success: <b>{buttonFunctionSuccessMessage}</b>,
            error: <b>{buttonFunctionErrorMessage}</b>,
          },
          {
            style: {
              borderRadius: "10px",
              background: "#333",
              color: "#fff",
            },
          },
        );
      }
    default:
      if (message) {
        return toast(message, {
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
      }
  }
}
