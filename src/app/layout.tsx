import "./globals.css";
import clsx from "clsx";
import type { Metadata } from "next";
import { Abril_Fatface, Raleway } from "next/font/google";

import Provider from "./_trpc/Provider";

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
  return (
    <html lang="en">
      <Provider>
        <body className={clsx(abrilFatface.variable, raleway.variable, "font-raleway selection:bg-slate-300")}>
          {children}
        </body>
      </Provider>
    </html>
  );
}
