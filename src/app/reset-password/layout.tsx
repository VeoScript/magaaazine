import { Metadata } from "next";

import DefaultLayout from "~/components/templates/DefaultLayout";

export const metadata: Metadata = {
  title: "Magaaazine | Reset Password",
};

export default function ResetPasswordLayout({ children }: { children: React.ReactNode }) {
  return (
    <DefaultLayout>
      <section className="-mt-10 flex h-full min-h-screen w-full flex-col items-center justify-center">
        {children}
      </section>
    </DefaultLayout>
  );
}
