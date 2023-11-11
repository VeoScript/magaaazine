import dynamic from "next/dynamic";

const DefaultLayout = dynamic(() => import("~/components/templates/DefaultLayout"));

export default function UserPageLayout({ children }: { children: React.ReactNode }) {
  return (
    <DefaultLayout>
      <section className="relative flex w-full flex-col items-center">{children}</section>
    </DefaultLayout>
  );
}
