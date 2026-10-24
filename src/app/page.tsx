import Link from "next/link";
import DefaultLayout from "~/components/templates/DefaultLayout";

import { serverClient } from "./_trpc/serverClient";

export default async function Home() {
  const user = await serverClient.user();

  return (
    <DefaultLayout backgroundClassName="bg-[#fbfaf7]">
      <section className="dark:bg-default-black relative isolate overflow-hidden bg-[#fbfaf7] text-[#292720] dark:text-white">
        <div className="mx-auto grid min-h-[min(760px,calc(100svh-72px))] w-full max-w-6xl items-center gap-14 px-5 py-16 sm:px-8 md:grid-cols-[1.05fr_0.95fr] md:gap-10 md:py-20">
          <div className="relative z-10 max-w-xl">
            <p className="mb-7 flex items-center gap-3 text-xs font-semibold tracking-[0.22em] text-[#8a744f] uppercase">
              <span className="h-px w-8 bg-[#9a8159]" />A little more human
            </p>
            <h1 className="font-serif text-[clamp(3rem,7vw,5.6rem)] leading-[1.02] font-normal tracking-[-0.045em]">
              Your profile is the cover.
              <span className="mt-2 block font-serif text-[#8a744f] italic">
                The good stuff is inside.
              </span>
            </h1>
            <p className="mt-7 max-w-lg text-base leading-7 text-neutral-600 md:text-lg md:leading-8 dark:text-neutral-300">
              A place to share what matters, meet new people, and hear what others really think —
              with messages, photos, and files sent anonymously.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link href="/discover" className="custom-button">
                Explore Magaaazine
              </Link>
              {!user && (
                <Link href="/signin" className="custom-button-outlined">
                  Sign in
                </Link>
              )}
            </div>
            <p className="mt-7 text-xs font-medium tracking-[0.16em] text-neutral-500 uppercase dark:text-neutral-400">
              Make a space that feels like you.
            </p>
          </div>

          <div className="mx-auto w-full max-w-[480px] md:ml-auto">
            <article className="border border-t-2 border-[#e3ded4] border-t-[#9a8159] bg-white p-5 sm:p-7 dark:border-slate-700 dark:border-t-[#b49a70] dark:bg-slate-900">
              <div className="flex items-center justify-between border-b border-neutral-200 pb-4 text-[10px] font-semibold tracking-[0.2em] text-neutral-500 uppercase dark:border-slate-700 dark:text-neutral-400">
                <span>Magaaazine / No. 01</span>
                <span>Make it yours</span>
              </div>
              <div className="py-7">
                <p className="font-serif text-3xl leading-tight sm:text-4xl">
                  More than a bio.
                  <br />
                  <span className="text-[#8a744f] dark:text-[#c3ae8a]">A conversation.</span>
                </p>
                <div className="mt-7 space-y-4">
                  <div className="max-w-[88%] border border-[#e8e3d9] bg-[#fbfaf7] p-4 dark:border-slate-700 dark:bg-slate-800">
                    <p className="text-[10px] font-semibold tracking-[0.16em] text-neutral-500 uppercase dark:text-neutral-400">
                      Anonymous note
                    </p>
                    <p className="mt-2 text-sm leading-6">
                      What is something you wish more people asked you about?
                    </p>
                  </div>
                  <div className="ml-auto max-w-[82%] bg-[#292720] p-4 text-white">
                    <p className="text-[10px] font-semibold tracking-[0.16em] text-white/75 uppercase">
                      Your reply
                    </p>
                    <p className="mt-2 text-sm leading-6">
                      The tiny things I collect when I travel.
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-neutral-200 pt-4 text-xs text-neutral-500 dark:border-slate-700 dark:text-neutral-400">
                <span>Messages, photos & files</span>
                <span aria-hidden="true">01 — 03</span>
              </div>
            </article>
          </div>
        </div>
      </section>
    </DefaultLayout>
  );
}
