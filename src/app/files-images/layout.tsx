import { Metadata } from "next";

import DefaultLayout from "~/components/templates/DefaultLayout";

export const metadata: Metadata = {
  title: "Magaaazine | Files and Images",
};

export default function FilesImagesLayout({ children }: { children: React.ReactNode }) {
  return (
    <DefaultLayout>
      <section className="flex h-full w-full flex-col items-center justify-center">
        {children}
      </section>
    </DefaultLayout>
  );
}
