import Link from "next/link";
import Image from "next/image";

import getBase64 from "~/lib/functions/getBase64";

export default async function Header() {
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
        <Image
          className="h-10 w-10 rounded-full bg-slate-600"
          src="https://pbs.twimg.com/media/F72ltruWsAEjx3-?format=jpg&name=900x900"
          alt="sea"
          priority
          width={500}
          height={500}
          quality={100}
          placeholder="blur"
          blurDataURL={await getBase64(
            "https://pbs.twimg.com/media/F72ltruWsAEjx3-?format=jpg&name=900x900",
          )}
        />
      </div>
    </nav>
  );
}
