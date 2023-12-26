"use client";

import clsx from "clsx";
import Image from "next/legacy/image";
import ActivityIndicator from "~/components/atoms/ActivityIndicator";

interface ViewImageModalProps {
  imageUrl: string;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  setImageUrl: () => void;
}

export default function ViewImageModal({
  imageUrl,
  isOpen,
  setIsOpen,
  setImageUrl,
}: ViewImageModalProps) {
  return (
    <div
      className={clsx(
        isOpen ? "scale-y-100" : "scale-y-0",
        "fixed inset-0 z-[60] flex h-full w-full origin-bottom transform flex-col items-center justify-center bg-black bg-opacity-80 px-3 pb-3 pt-[4rem] transition duration-300 md:pt-3",
      )}
    >
      <button
        title="Close"
        className="absolute right-3 top-3 z-[70] rounded-full bg-neutral-800 p-2 outline-none hover:opacity-50"
        onClick={() => {
          setImageUrl();
          setIsOpen(false);
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-5 w-5 text-white"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      {isOpen && (
        <div className="flex h-full w-full flex-col  items-center justify-center bg-transparent">
          <ActivityIndicator color="#fff" className="h-10 w-10 bg-transparent" />
        </div>
      )}
      <div className="z-[60] flex h-auto w-auto flex-col items-center justify-center overflow-hidden">
        <Image
          priority
          src={imageUrl}
          className="h-auto w-auto object-contain"
          alt="Message Image"
          layout="fill"
          quality={100}
          placeholder="blur"
          blurDataURL={imageUrl}
        />
      </div>
    </div>
  );
}
