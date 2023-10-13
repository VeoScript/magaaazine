import "./globals.css";
import clsx from "clsx";
import cron from "node-cron";
import NextTopLoader from "nextjs-toploader";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Toaster } from "react-hot-toast";
import { Abril_Fatface, Raleway, Poppins } from "next/font/google";

import Provider from "./_trpc/Provider";
import CheckAuth from "~/components/molecules/CheckAuth";

import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";

import { ourFileRouter } from "~/app/api/uploadthing/core";
import { serverClient } from "./_trpc/serverClient";

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

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["200", "400", "600", "800"],
  preload: true,
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Magaaazine",
  description: "Empower Your Online Presence with Magaaazine",
  metadataBase: new URL(
    process.env.NODE_ENV === "development" ? `${process.env.DEV_URL}` : `${process.env.PROD_URL}`,
  ),
  openGraph: {
    type: "website",
    url:
      process.env.NODE_ENV === "development" ? `${process.env.DEV_URL}` : `${process.env.PROD_URL}`,
    title: "Magaaazine",
    description: "Empower Your Online Presence with Magaaazine",
    siteName: "Magaaazine",
    images: "/images/magaaazine_seo.png",
  },
  twitter: {
    title: "Magaaazine",
    description: "Empower Your Online Presence with Magaaazine",
    creator: "Jerome Villaruel (Veoscript)",
    site: "Magaaazine",
    images: "/images/magaaazine_seo.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const hasCookies = cookies().has(`${process.env.COOKIE_NAME}`);

  // DELETE FILES IN UPLOADTHING AND DATABASE IN EVERY 1 DAY...
  cron.schedule("0 0 * * *", async () => {
    console.log("CRON JOB IS TRIGGERED...");
    const allFiles = await serverClient.allFilesImages();
    await serverClient.deleteAllFilesImages({
      type: "FILE",
      files: allFiles ? allFiles.map((file) => file.delete_url) : [],
    });
  });

  return (
    <html lang="en">
      <Provider>
        <body
          className={clsx(
            abrilFatface.variable,
            raleway.variable,
            poppins.variable,
            "font-raleway selection:bg-slate-300",
          )}
        >
          <NextSSRPlugin
            /**
             * The `extractRouterConfig` will extract **only** the route configs
             * from the router to prevent additional information from being
             * leaked to the client. The data passed to the client is the same
             * as if you were to fetch `/api/uploadthing` directly.
             */
            routerConfig={extractRouterConfig(ourFileRouter)}
          />
          <CheckAuth hasCookies={hasCookies} />
          <Toaster position="bottom-right" reverseOrder={false} />
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
