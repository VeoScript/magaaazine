import { ReactNode } from "react";
import dynamic from "next/dynamic";
import clsx from "clsx";
import Header from "../organisms/Header";

const Footer = dynamic(() => import("../organisms/Footer"));

interface DefaultLayoutProps {
  children: ReactNode;
  backgroundClassName?: string;
}

export default function DefaultLayout({
  children,
  backgroundClassName = "bg-white",
}: DefaultLayoutProps) {
  return (
    <main
      className={clsx(
        "font-raleway text-default-black dark:bg-default-black relative flex min-h-screen w-full flex-col items-center dark:text-white",
        backgroundClassName,
      )}
    >
      <Header />
      <section className="flex w-full flex-1 flex-col">{children}</section>
      <Footer />
    </main>
  );
}
