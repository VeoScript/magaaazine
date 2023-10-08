import Link from "next/link";
import DefaultLayout from "~/components/templates/DefaultLayout";

export default function Home() {
  return (
    <DefaultLayout>
      <section className="flex h-full min-h-screen w-full flex-col items-center justify-center p-5">
        <div className="-mt-20 flex w-full max-w-[1210px] flex-col items-center gap-y-3">
          <h2 className="text-center font-raleway text-2xl font-bold">
            Discover, Connect and Share.
          </h2>
          <h1 className="text-center font-raleway text-[4rem] font-light uppercase">
            Empower your online presence with{" "}
            <span className="font-abril-fatface uppercase">Magaaazine</span>.
          </h1>
          <h2 className="text-center font-raleway text-xl">
            With feature of sending <span className="font-bold text-blue-500">messages</span>,{" "}
            <span className="font-bold text-green-500">images</span>,{" and "}
            <span className="font-bold text-purple-500">files</span> anonymously.
          </h2>
          <div className="mt-5 flex w-full flex-row items-center justify-center gap-x-3">
            <Link href="/discover" className="custom-button">
              Discover
            </Link>
            <Link href="/signin" className="custom-button-outlined">
              Sign in
            </Link>
          </div>
        </div>
      </section>
    </DefaultLayout>
  );
}
