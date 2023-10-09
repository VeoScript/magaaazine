import { ReactNode } from "react";
import Header from "../organisms/Header";
import Footer from "../organisms/Footer";

interface DefaultLayoutProps {
  children: ReactNode;
}

export default function DefaultLayout({ children }: DefaultLayoutProps) {
  return (
    <main className="flex h-full min-h-screen w-full flex-col items-center">
      <Header />
      <section className="relative h-full w-full flex-grow">{children}</section>
      <Footer />
    </main>
  );
}
