import "./globals.css";
import clsx from "clsx";
import NextTopLoader from "nextjs-toploader";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Toaster } from "react-hot-toast";
import { Abril_Fatface, Raleway } from "next/font/google";

import Provider from "./_trpc/Provider";
import CheckAuth from "~/components/molecules/CheckAuth";

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
          <NextTopLoader
            color="#2299DD"
            initialPosition={0.08}
            crawlSpeed={200}
            height={3}
            crawl={true}
            showSpinner={false}
            easing="ease"
            speed={200}
            shadow="0 0 10px #2299DD,0 0 5px #2299DD"
          />
          {children}
        </body>
      </Provider>
    </html>
  );
}
