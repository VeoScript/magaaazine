"use client";

import clsx from "clsx";
import { useId } from "react";

interface AlertModalProps {
  title?: string;
  message: string;
  isPending?: boolean;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  modalFunction: () => void;
}

export default function AlertModalDynamic({
  title,
  message,
  isPending,
  isOpen,
  setIsOpen,
  modalFunction,
}: AlertModalProps) {
  const titleId = useId();
  const messageId = useId();

  return (
    <div
      aria-hidden={!isOpen}
      inert={!isOpen}
      className={clsx(
        isOpen ? "opacity-100" : "pointer-events-none opacity-0",
        "fixed inset-0 z-[60] flex h-full w-full items-center justify-center bg-black/50 px-4 py-6 backdrop-blur-sm transition-opacity duration-200",
      )}
    >
      <button
        type="button"
        aria-label="Close confirmation dialog"
        disabled={isPending}
        className="absolute inset-0 h-full w-full cursor-default bg-transparent outline-none"
        onClick={() => !isPending && setIsOpen(false)}
      />
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-label={title ? undefined : "Confirm action"}
        aria-describedby={messageId}
        className={clsx(
          isOpen ? "scale-100" : "scale-95",
          "font-poppins relative z-[60] flex h-auto w-full max-w-md flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white text-default-black shadow-2xl shadow-black/20 transition-transform duration-200 dark:border-slate-700 dark:bg-default-black dark:text-white",
        )}
      >
        <div className="flex w-full flex-col gap-6 p-6">
          {title && (
            <div className="flex w-full flex-row items-center">
              <h2 id={titleId} className="text-lg font-semibold">
                {title}
              </h2>
            </div>
          )}
          <div className="flex w-full flex-row items-center">
            <p id={messageId} className="text-sm leading-6 text-neutral-600 dark:text-slate-300">
              {message}
            </p>
          </div>
          <div className="flex w-full flex-col-reverse justify-end gap-2 sm:flex-row">
            <button
              disabled={isPending}
              type="button"
              className="rounded-lg border border-neutral-300 px-4 py-2.5 text-sm font-medium text-neutral-700 outline-none transition-colors hover:bg-neutral-100 focus-visible:ring-2 focus-visible:ring-neutral-400 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800 dark:focus-visible:ring-slate-500"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </button>
            <button
              disabled={isPending}
              type="button"
              className={clsx(
                "rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white outline-none transition-colors hover:bg-red-700 focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:focus-visible:ring-offset-default-black",
              )}
              onClick={modalFunction}
            >
              {isPending ? "Loading..." : "Proceed"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
