import { ReactNode } from "react";
import Header from "../organisms/Header";
import Footer from "../organisms/Footer";

interface DefaultLayoutProps {
  children: ReactNode;
}

export default function DefaultLayout({ children }: DefaultLayoutProps) {
  return (
    <main className="flex h-full w-full flex-col items-center">
      <Header />
      {children}
      <Footer />
    </main>
  );
}
