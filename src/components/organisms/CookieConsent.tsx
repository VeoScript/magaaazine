"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { hasCookie, setCookie } from "cookies-next";

import Link from "next/link";

const CookieConsent = (): JSX.Element => {
  const pathname = usePathname();

  const [showConsent, setShowConsent] = useState(true);

  // Calculate the time for one month in milliseconds
  const oneMonth = 30 * 24 * 60 * 60 * 1000; // 30 days * 24 hours * 60 minutes * 60 seconds * 1000 milliseconds

  // Create a new Date object for the expiration date
  const expirationDate = new Date();
  expirationDate.setTime(expirationDate.getTime() + oneMonth);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowConsent(hasCookie("magaazine-cookie-consent"));
    }, 5000);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  const acceptCookie = () => {
    setShowConsent(true);
    setCookie("magaazine-cookie-consent", "true", {
      maxAge: oneMonth,
      expires: expirationDate,
    });
  };

  if (showConsent || pathname === "/terms-and-conditions" || pathname === "/pricing") {
    return <></>;
  }

  return (
    <div className="fixed inset-0 z-[9999] bg-slate-700 bg-opacity-70 backdrop-blur-sm">
      <div className="fixed bottom-0 left-0 right-0 flex w-full flex-col items-center justify-center gap-y-3 bg-gray-100 px-4 py-8 dark:bg-default-black md:flex-row md:justify-between md:gap-y-0 md:px-10">
        <span className="w-full text-center text-base text-default-black dark:text-white md:text-left">
          This website uses cookies to improve user experience. By using our website you consent to
          all cookies in accordance with our{" "}
          <Link href="/terms-and-conditions/#cookies" className="font-bold hover:underline">
            Cookie Policy
          </Link>
          .
        </span>
        <button
          className="rounded bg-green-700 px-8 py-2 text-white transition duration-200 ease-in-out hover:opacity-50"
          onClick={acceptCookie}
        >
          Accept
        </button>
      </div>
    </div>
  );
};

export default CookieConsent;
