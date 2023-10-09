import Link from "next/link";

import getBase64 from "~/lib/functions/getBase64";
import ProfileMenu from "../molecules/Menus/ProfileMenu";

import { serverClient } from "~/app/_trpc/serverClient";

export default async function Header() {
  const user = await serverClient.user();

  const profileBlurUrl = user ? await getBase64(user?.profile_photo as string) : "";

  return (
    <nav className="flex w-full max-w-[1210px] flex-row items-center justify-between p-3">
      <Link href="/">
        <h1 className="font-abril-fatface text-2xl uppercase">Magaaazine</h1>
      </Link>
      <div className="flex flex-row items-center gap-x-5">
        <Link href="/" className="hover:opacity-80">
          Home
        </Link>
        <Link href="/" className="hover:opacity-80">
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
  );
}
