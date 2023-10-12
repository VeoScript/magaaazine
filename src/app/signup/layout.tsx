import DefaultLayout from "~/components/templates/DefaultLayout";

export default function SignUpLayout({ children }: { children: React.ReactNode }) {
  return (
    <DefaultLayout>
      <section className="-mt-10 flex h-full min-h-screen w-full flex-col items-center justify-center">
        {children}
      </section>
    </DefaultLayout>
  );
}
