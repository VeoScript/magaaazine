import Link from "next/link";

export default function Header() {
  return (
    <nav className="flex w-full max-w-[1210px] flex-row items-center justify-between p-3">
      <Link href="/">
        <h1 className="font-abril-fatface text-2xl uppercase">Magaaazine</h1>
      </Link>
      <div className="flex flex-row items-center gap-x-5">
        <Link href="/" className="hover:opacity-80">Home</Link>
        <Link href="/" className="hover:opacity-80">Pricing</Link>
        <div className="h-10 w-10 rounded-full bg-slate-600" />
      </div>
    </nav>
  );
}
