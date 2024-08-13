"use client";

import clsx from "clsx";
import Image from "next/image";

export default function Pricing() {
  return (
    <div className="flex w-full flex-col items-center">
      <div className="flex w-full max-w-[1210px] flex-col items-center justify-center gap-x-10 gap-y-2 p-5 md:flex-row md:items-start md:gap-y-0 md:p-0">
        <div className="flex h-full w-full max-w-md flex-col items-center rounded-lg border border-neutral-300 p-5 dark:border dark:border-slate-700">
          <div className="flex w-full flex-col items-center">
            <Image
              className="h-[10rem] w-[10rem] rounded-full bg-white object-scale-down"
              src="/magaaazine.png"
              alt="magaaazine"
              priority
              width={100}
              height={100}
              quality={100}
              placeholder="blur"
              blurDataURL="/magaaazine.png"
            />
          </div>
          <div className="flex w-full flex-col items-center gap-y-3">
            <h1 className="font-poppins text-[3rem] font-bold text-neutral-800 dark:text-blue-500">
              <span className="text-xl font-normal">₱</span> 0
              <span className="text-xl font-normal">/month</span>
            </h1>
            <h2 className="text-xl font-semibold">Free Forever</h2>
            <ul className="mt-3 flex flex-col items-center gap-y-2">
              {pricingFree.map((pricing: { feature: string; status: boolean }, index: number) => (
                <li key={index} className="flex w-full flex-row items-center justify-start gap-x-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className={clsx(pricing.status ? " text-lime-500" : "text-blue-500", "h-6 w-6")}
                  >
                    <path
                      fillRule="evenodd"
                      d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>{pricing.feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="flex h-full w-full max-w-md flex-col items-center gap-y-5 rounded-lg border border-neutral-300 p-5 dark:border dark:border-slate-700">
          <div className="flex w-full flex-col items-center">
            <Image
              className="h-[10rem] w-[10rem] rounded-full bg-white object-scale-down"
              src="/magaaazine_pro.png"
              alt="magaaazine_pro"
              priority
              width={100}
              height={100}
              quality={100}
              placeholder="blur"
              blurDataURL="/magaaazine_pro.png"
            />
          </div>
          <div className="flex w-full flex-col items-center gap-y-3">
            <h1 className="font-poppins text-[3rem] font-bold text-neutral-800 dark:text-blue-500">
              <span className="text-xl font-normal">₱</span> 250
              <span className="text-xl font-normal">/month</span>
            </h1>
            <h2 className="text-xl font-semibold">Pro</h2>
            <ul className="mt-3 flex flex-col items-center gap-y-2">
              {pricingPro.map((pricing: { feature: string; status: boolean }, index: number) => (
                <li key={index} className="flex w-full flex-row items-center justify-start gap-x-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className={clsx(pricing.status ? " text-lime-500" : "text-blue-500", "h-6 w-6")}
                  >
                    <path
                      fillRule="evenodd"
                      d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>{pricing.feature}</span>
                </li>
              ))}
            </ul>
          </div>
          <button disabled type="button" className="custom-button cursor-progress text-sm">
            On going - (You can use this for free as of now)
          </button>
        </div>
      </div>
    </div>
  );
}

const pricingFree = [
  {
    feature: "Send messages to all users.",
    status: true,
  },
  {
    feature: "Send only 3 files and images per message.",
    status: true,
  },
  {
    feature: "Auto delete received files after 1 day.",
    status: true,
  },
  {
    feature: "Verified account. (as of now)",
    status: false,
  },
];

const pricingPro = [
  {
    feature: "Verified account.",
    status: true,
  },
  {
    feature: "Send messages to all users.",
    status: true,
  },
  {
    feature: "Send only 5 files and images per message.",
    status: true,
  },
  {
    feature: "Auto delete received files after 7 days.",
    status: true,
  },
];
