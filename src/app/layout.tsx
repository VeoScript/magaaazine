import "./globals.css";
import clsx from "clsx";
import NextTopLoader from "nextjs-toploader";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Toaster } from "react-hot-toast";
import { Abril_Fatface, Raleway } from "next/font/google";

import Provider from "./_trpc/Provider";
import CheckAuth from "~/components/molecules/CheckAuth";

import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";

import { ourFileRouter } from "~/app/api/uploadthing/core";

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
  description: "Empower Your Online Presence with Magaaazine",
  openGraph: {
    type: "website",
    url:
      process.env.NODE_ENV === "development" ? `${process.env.DEV_URL}` : `${process.env.PROD_URL}`,
    title: "Magaaazine",
    description: "Empower Your Online Presence with Magaaazine",
    siteName: "Magaaazine",
    images: [
      {
        url: "https://lh3.googleusercontent.com/pw/ADCreHfUf2cZYHFzdJIvqpADUJ41upclmv5UmEth4GwEWjdEoDxQJsnEL3w7r4bzhNh4k3ojSoPnqQfbI0rK3JV_YehiWuO9I4hyQZE1j18XXOgo57VDKompQzpfrkCbXXaXsPjbFeb9t7qT-srEX2XHZ28TL8CyqFXlG41JNO049m9Ui9zVoxIijvXlGhMOs4SWN2_DAFKuo6uzNhHgsEbj3IGjT-gOBYfFlETYflk_bPSjw_poKzJFybhpzrL7dm7hwzVZSpozxuMdduG_5_O7kD6V5mbFnCP0Baq2SoTgjGc4XaeGNb5Ki2fraCbuY60wD1p79Za0BrOTia0COCZKXBC7q2Oj6GMiL2VLzd8e6qM9dzjx-51_GnciiaBPLw3vmHdaM64HyEpYr749TAXGNrXrhXrBBO4VX7_CVWLjt78DgYnBgqWH6X9Eo-lTfq0pUrvCiy7p66mO0tMJb_I902mQLbcUcMwTyVwbJFQVyYCUJdTAipPGlMuXxqDoIcL-Jt4q2HneUt5Wy0A9CymVAy4pwbtrNX3p1ehECjtYNPLHF6EMmziJzwGATnA2pqkIg5VOcNWNwriRk4DyG1X5M0HxC3ARSOibXt3uQClh6JxTkKwSiwillCPBEpQILCf4EaxhB2_arqJbBGO7roe13_T_P68Sjy8fvJpOw_g8dI7dpEHlKpPSuFBYhB_7aqMQkUeoUCNl3VsmaR4Gihg8dRDxMv2MavER80By2IszCv27TYaEN0I_0f4EX8W6-pDeL01XdMGMaqH73XrOSnOm4DPwN_bu56TNumacaTwd4rDXqrD3lb6Fq5dCLnKJVKoNLDkusNMUbjBPG1RCjlZEpHekaUORfCTrn08bxtbDPqN7wNqtU8QUsmoI3U8rf-4GH_t2vJQLEXgYXlcrEknHagAYfPK9Eaz7_X32tD0AAd1u-DVMkeKdC-Un8g6WPwYb2Se_DLSTKjrrBkzDh2yaMPgTz8ZgB1qKeGqmJwkXVs35Go6d-wStf94ho9cJVBAdXao=w1893-h931-s-no?authuser=0",
      },
    ],
  },
  twitter: {
    title: "Magaaazine",
    description: "Empower Your Online Presence with Magaaazine",
    creator: "Jerome Villaruel (Veoscript)",
    site: "Magaaazine",
    images: [
      {
        url: "https://lh3.googleusercontent.com/pw/ADCreHfUf2cZYHFzdJIvqpADUJ41upclmv5UmEth4GwEWjdEoDxQJsnEL3w7r4bzhNh4k3ojSoPnqQfbI0rK3JV_YehiWuO9I4hyQZE1j18XXOgo57VDKompQzpfrkCbXXaXsPjbFeb9t7qT-srEX2XHZ28TL8CyqFXlG41JNO049m9Ui9zVoxIijvXlGhMOs4SWN2_DAFKuo6uzNhHgsEbj3IGjT-gOBYfFlETYflk_bPSjw_poKzJFybhpzrL7dm7hwzVZSpozxuMdduG_5_O7kD6V5mbFnCP0Baq2SoTgjGc4XaeGNb5Ki2fraCbuY60wD1p79Za0BrOTia0COCZKXBC7q2Oj6GMiL2VLzd8e6qM9dzjx-51_GnciiaBPLw3vmHdaM64HyEpYr749TAXGNrXrhXrBBO4VX7_CVWLjt78DgYnBgqWH6X9Eo-lTfq0pUrvCiy7p66mO0tMJb_I902mQLbcUcMwTyVwbJFQVyYCUJdTAipPGlMuXxqDoIcL-Jt4q2HneUt5Wy0A9CymVAy4pwbtrNX3p1ehECjtYNPLHF6EMmziJzwGATnA2pqkIg5VOcNWNwriRk4DyG1X5M0HxC3ARSOibXt3uQClh6JxTkKwSiwillCPBEpQILCf4EaxhB2_arqJbBGO7roe13_T_P68Sjy8fvJpOw_g8dI7dpEHlKpPSuFBYhB_7aqMQkUeoUCNl3VsmaR4Gihg8dRDxMv2MavER80By2IszCv27TYaEN0I_0f4EX8W6-pDeL01XdMGMaqH73XrOSnOm4DPwN_bu56TNumacaTwd4rDXqrD3lb6Fq5dCLnKJVKoNLDkusNMUbjBPG1RCjlZEpHekaUORfCTrn08bxtbDPqN7wNqtU8QUsmoI3U8rf-4GH_t2vJQLEXgYXlcrEknHagAYfPK9Eaz7_X32tD0AAd1u-DVMkeKdC-Un8g6WPwYb2Se_DLSTKjrrBkzDh2yaMPgTz8ZgB1qKeGqmJwkXVs35Go6d-wStf94ho9cJVBAdXao=w1893-h931-s-no?authuser=0",
      },
    ],
  },
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
