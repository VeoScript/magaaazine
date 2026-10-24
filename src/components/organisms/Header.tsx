import Link from "next/link";
import clsx from "clsx";

import getBase64 from "~/lib/functions/getBase64";
import ProfileMenu from "../molecules/Menus/ProfileMenu";

import { serverClient } from "~/app/_trpc/serverClient";

export default async function Header() {
  const user = await serverClient.user();

  const profileBlurUrl = user ? await getBase64(user?.profile_photo as string) : "";

  return (
    <nav className="font-raleway dark:bg-default-black/95 sticky top-0 z-30 flex w-full flex-col items-center border-b border-[#e8e3d9] bg-[#fbfaf7]/95 px-4 backdrop-blur-md md:px-8 dark:border-slate-700">
      <nav
        className={clsx(
          user
            ? "flex flex-row items-center justify-between"
            : "flex flex-col items-center justify-center gap-y-3 md:flex-row md:justify-between md:gap-y-0",
          "w-full max-w-6xl py-4",
        )}
      >
        <Link href="/">
          <h1 className="font-serif text-xl font-semibold tracking-[-0.035em] uppercase md:text-2xl">
            Magaaazine<span className="text-[#9a8159]">.</span>
          </h1>
        </Link>
        <div className="flex flex-row items-center gap-x-6">
          <Link
            href="/"
            className={clsx(
              user ? "hidden md:block" : "block",
              "text-sm font-medium text-neutral-600 transition-colors hover:text-[#9a8159] md:block dark:text-neutral-300 dark:hover:text-white",
            )}
          >
            Home
          </Link>
          <Link
            href="/discover"
            className={clsx(
              user ? "hidden md:block" : "block",
              "text-sm font-medium text-neutral-600 transition-colors hover:text-[#9a8159] md:block dark:text-neutral-300 dark:hover:text-white",
            )}
          >
            Discover
          </Link>
          <Link
            href="/pricing"
            className={clsx(
              user ? "hidden md:block" : "block",
              "text-sm font-medium text-neutral-600 transition-colors hover:text-[#9a8159] md:block dark:text-neutral-300 dark:hover:text-white",
            )}
          >
            Pricing
          </Link>
          {user && (
            <ProfileMenu
              user={user}
              imageSrc={user.profile_photo as string}
              imageBlurUrl={profileBlurUrl as string}
            />
          )}
        </div>
      </nav>
    </nav>
  );
}
