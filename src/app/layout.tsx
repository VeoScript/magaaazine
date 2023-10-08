import "./globals.css";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Abril_Fatface, Raleway } from "next/font/google";

import clsx from "clsx";
import Provider from "./_trpc/Provider";
import CheckAuth from "~/components/molecules/CheckAuth";
import { Toaster } from "react-hot-toast";

const abrilFatface = Abril_Fatface({
  subsets: ["latin"],
  weight: ["400"],
  preload: true,
  variable: "--font-abril-fatface",
});

const raleway = Raleway({
  subsets: ["latin"],
  weight: ["200", "400", "600", "800"],
  preload: true,
  variable: "--font-raleway",
});

export const metadata: Metadata = {
  title: "Magaaazine",
  description: "Your personal global magazine.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const hasCookies = cookies().has(`${process.env.COOKIE_NAME}`);

  return (
    <html lang="en">
      <Provider>
        <body
          className={clsx(
            abrilFatface.variable,
            raleway.variable,
            "font-raleway selection:bg-slate-300",
          )}
        >
          <CheckAuth hasCookies={hasCookies} />
          <Toaster position="top-center" reverseOrder={false} />
          {children}
        </body>
      </Provider>
    </html>
  );
}
