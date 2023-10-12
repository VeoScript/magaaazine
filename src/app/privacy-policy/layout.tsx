import DefaultLayout from "~/components/templates/DefaultLayout";

export default function PrivacyPolicyLayout({ children }: { children: React.ReactNode }) {
  return (
    <DefaultLayout>
      <section className="mt-5 flex h-full min-h-full w-full flex-col items-center justify-center md:min-h-screen">
        {children}
      </section>
    </DefaultLayout>
  );
}
