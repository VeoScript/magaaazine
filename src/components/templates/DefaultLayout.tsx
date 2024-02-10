import { ReactNode } from "react";
import dynamic from "next/dynamic";
import Header from "../organisms/Header";

const Footer = dynamic(() => import("../organisms/Footer"));

interface DefaultLayoutProps {
  children: ReactNode;
}

export default function DefaultLayout({ children }: DefaultLayoutProps) {
  return (
    <main className="relative flex h-full min-h-screen w-full flex-col items-center bg-white text-default-black dark:bg-default-black dark:text-white">
      <Header />
      <section className="h-full w-full flex-grow">{children}</section>
      <Footer />
    </main>
  );
}
