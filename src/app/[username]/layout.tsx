import DefaultLayout from "~/components/templates/DefaultLayout";

export default function UserPageLayout({ children }: { children: React.ReactNode }) {
  return (
    <DefaultLayout>
      <section className="relative flex w-full flex-col items-center">{children}</section>
    </DefaultLayout>
  );
}
