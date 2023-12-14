import Link from "next/link";
import DefaultLayout from "~/components/templates/DefaultLayout";

import { serverClient } from "./_trpc/serverClient";

export default async function Home() {
  const user = await serverClient.user();

  return (
    <DefaultLayout>
      <section className="flex h-full min-h-full w-full flex-col items-center justify-start p-2 md:min-h-screen md:justify-center md:p-5">
        <div className="mt-[5rem] flex w-full max-w-full flex-col items-center gap-y-5 md:-mt-20 md:max-w-5xl md:gap-y-5">
          <h2 className="text-center font-raleway text-xl font-bold md:text-2xl">
            Discover, Connect and Share.
          </h2>
          <h1 className="text-center font-raleway text-4xl font-light uppercase leading-normal md:text-[4rem] md:leading-[5rem]">
            Empower your online presence with{" "}
            <span className="text-shadow-neutral font-abril-fatface uppercase">Magaaazine</span>.
          </h1>
          <h2 className="text-center font-raleway text-base md:text-xl">
            With feature of sending{" "}
            <span className="text-shadow-blue font-bold text-blue-600">messages</span>,{" "}
            <span className="text-shadow-blue font-bold text-blue-600">images</span>,{" and "}
            <span className="text-shadow-blue font-bold text-blue-600">files</span> anonymously.
          </h2>
          <div className="mt-1 flex w-full flex-row items-center justify-center gap-x-3 md:mt-5">
            <Link href="/discover" className="custom-button">
              Discover
            </Link>
            {!user && (
              <Link href="/signin" className="custom-button-outlined">
                Sign in
              </Link>
            )}
          </div>
        </div>
      </section>
    </DefaultLayout>
  );
}
