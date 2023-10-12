import DefaultLayout from "~/components/templates/DefaultLayout";

export default function ForgotPasswordLayout({ children }: { children: React.ReactNode }) {
  return (
    <DefaultLayout>
      <section className="flex h-full min-h-screen -mt-10 w-full flex-col items-center justify-center">
        {children}
      </section>
    </DefaultLayout>
  );
}
