import { Metadata } from "next";

import DefaultLayout from "~/components/templates/DefaultLayout";

export const metadata: Metadata = {
  title: "Magaaazine | Messages",
};

export default function MessagesLayout({ children }: { children: React.ReactNode }) {
  return (
    <DefaultLayout>
      <section className="flex h-full w-full flex-col items-center justify-center">
        {children}
      </section>
    </DefaultLayout>
  );
}
