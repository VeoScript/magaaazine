"use client";

import { toast } from "sonner";

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
  const getCurrentTheme = () =>
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
      : () => {};

  const isDarkMode = getCurrentTheme();

  switch (type) {
    case "success":
      if (message) {
        return toast.success(message, {
          className: "font-poppins",
          style: {
            border: "none",
            borderRadius: "10px",
            background: "#ECFDF3",
            color: "#008A2E",
            fontSize: "12px",
          },
        });
      }
    case "error":
      if (message) {
        return toast.error(message, {
          className: "font-poppins",
          style: {
            border: "none",
            borderRadius: "10px",
            background: "#FFF0F0",
            color: "#E60000",
            fontSize: "12px",
          },
        });
      }
    case "promise":
      if (buttonFunction) {
        return toast.promise(buttonFunction(), {
          loading: buttonLoadingMessage ?? "",
          success: () => {
            return (
              <div className="flex w-full flex-row items-center gap-x-3">
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
                <p className="font-medium text-lime-600">{buttonFunctionSuccessMessage}</p>
              </div>
            );
          },
          error: () => {
            return (
              <div className="flex w-full flex-row items-center gap-x-3">
                <div className="relative flex h-6 w-6 flex-row items-center justify-center">
                  <span className="absolute h-3 w-3 rounded-full bg-white" />
                  <svg
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                    className="absolute h-full w-full text-red-500"
                  >
                    <path
                      clipRule="evenodd"
                      fillRule="evenodd"
                      d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z"
                    />
                  </svg>
                </div>
                <p className="font-medium text-red-500">{buttonFunctionErrorMessage}</p>
              </div>
            );
          },
          className: "font-poppins",
          style: {
            border: "none",
            borderRadius: "10px",
            background: `${isDarkMode ? "#121518" : "#FFFFFF"}`,
            color: `${isDarkMode ? "#FFFFFF" : "#121518"}`,
            fontSize: "12px",
          },
        });
      }
    default:
      if (message) {
        return toast(message, {
          className: "font-poppins",
          style: {
            border: "none",
            borderRadius: "10px",
            background: `${isDarkMode ? "#121518" : "#FFFFFF"}`,
            color: `${isDarkMode ? "#FFFFFF" : "#121518"}`,
            fontSize: "12px",
          },
        });
      }
  }
}
