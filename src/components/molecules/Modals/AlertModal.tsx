"use client";

import clsx from "clsx";

interface AlertModalProps {
  title?: string;
  message: string;
  isPending?: boolean;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  modalFunction: () => void;
}

export default function AlertModal({
  title,
  message,
  isPending,
  isOpen,
  setIsOpen,
  modalFunction,
}: AlertModalProps) {
  return (
    <div
      className={clsx(
        isOpen ? "scale-y-100" : "scale-y-0",
        "fixed inset-0 z-[60] flex h-full w-full origin-bottom transform flex-col items-center justify-center bg-black bg-opacity-80 px-3 pb-3 pt-[4rem] transition duration-300 md:pt-3",
      )}
    >
      <button
        className="absolute h-full w-full flex-1 cursor-default bg-transparent outline-none"
        onClick={() => setIsOpen(false)}
      />
      <div className="font-poppins z-[60] flex h-auto w-full max-w-sm flex-col items-center justify-center overflow-hidden rounded-lg bg-white dark:bg-default-black bg-opacity-20 text-white backdrop-blur-sm">
        <div className="flex w-full flex-col items-start justify-center p-3">
          {title && (
            <div className="flex w-full flex-row items-center p-3">
              <p className="text-base font-medium text-white">{title}</p>
            </div>
          )}
          <div className="flex w-full flex-row items-center p-3">
            <p className="text-base font-light text-white">{message}</p>
          </div>
          <div className="flex w-full flex-row items-center justify-end gap-x-1 p-3">
            <button
              disabled={isPending}
              type="button"
              className={clsx(
                isPending && "opacity-50",
                "rounded-lg bg-red-500 px-3 py-2 text-base text-white outline-none hover:bg-opacity-50",
              )}
              onClick={modalFunction}
            >
              {isPending ? "Loading..." : "Proceed"}
            </button>
            <button
              type="button"
              className="rounded-lg bg-neutral-500 px-3 py-2 text-base text-white outline-none hover:bg-opacity-50"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
