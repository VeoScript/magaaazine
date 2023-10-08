import DefaultLayout from "~/components/templates/DefaultLayout";

export default function SignInLayout({ children }: { children: React.ReactNode }) {
  return (
    <DefaultLayout>
      <section className="flex h-full min-h-[30rem] w-full flex-col items-center justify-center">
        {children}
      </section>
    </DefaultLayout>
  );
}
