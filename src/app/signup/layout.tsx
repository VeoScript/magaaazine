import DefaultLayout from "~/components/templates/DefaultLayout";

export default function SignUpLayout({ children }: { children: React.ReactNode }) {
  return (
    <DefaultLayout>
      <section className="flex h-full min-h-[35rem] w-full flex-col items-center justify-center">
        {children}
      </section>
    </DefaultLayout>
  );
}
