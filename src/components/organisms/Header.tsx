import Link from "next/link";
import clsx from "clsx";

import getBase64 from "~/lib/functions/getBase64";
import ProfileMenu from "../molecules/Menus/ProfileMenu";

import { serverClient } from "~/app/_trpc/serverClient";

export default async function Header() {
  const user = await serverClient.user();

  const profileBlurUrl = user ? await getBase64(user?.profile_photo as string) : "";

  return (
    <nav className="dark:bg-default-black sticky top-0 z-30 px-2 md:px-0 flex w-full flex-col items-center bg-white bg-opacity-50 backdrop-blur-sm dark:bg-opacity-50 dark:backdrop-blur-sm">
      <nav
        className={clsx(
          user
            ? "flex flex-row items-center justify-between"
            : "flex flex-col items-center justify-center gap-y-3 md:flex-row md:justify-between md:gap-y-0",
          "w-full max-w-[1210px] rounded-b-xl p-3",
        )}
      >
        <Link href="/">
          <h1 className="font-abril-fatface text-lg md:text-2xl uppercase">Magaaazine</h1>
        </Link>
        <div className="flex flex-row items-center gap-x-5">
          <Link
            href="/"
            className={clsx(
              user ? "hidden md:block" : "block",
              "text-sm hover:opacity-80 md:block",
            )}
          >
            Home
          </Link>
          <Link
            href="/discover"
            className={clsx(
              user ? "hidden md:block" : "block",
              "text-sm hover:opacity-80 md:block",
            )}
          >
            Discover
          </Link>
          <Link
            href="/pricing"
            className={clsx(
              user ? "hidden md:block" : "block",
              "text-sm hover:opacity-80 md:block",
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
