import DefaultLayout from "~/components/templates/DefaultLayout";

export default function UserPageLayout({ children }: { children: React.ReactNode }) {
  return (
    <DefaultLayout>
      <section className="relative flex h-full w-full flex-col items-center justify-center">
        {children}
      </section>
    </DefaultLayout>
  );
}
