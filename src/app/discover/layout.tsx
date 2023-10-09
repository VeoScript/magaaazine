import DefaultLayout from "~/components/templates/DefaultLayout";

export default function DiscoverLayout({ children }: { children: React.ReactNode }) {
  return (
    <DefaultLayout>
      <section className="flex h-full w-full flex-col items-center justify-center">
        {children}
      </section>
    </DefaultLayout>
  );
}
