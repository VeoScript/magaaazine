import Link from "next/link";

export default function Home() {
  return (
    <main className="flex h-full w-full flex-col items-center">
      <nav className="flex w-full max-w-[1210px] flex-row items-center justify-between p-3">
        <Link href="/">
          <h1 className="font-abril-fatface text-2xl uppercase">Magaaazine</h1>
        </Link>
        <div className="flex flex-row items-center gap-x-5">
          <Link href="/">Home</Link>
          <Link href="/">Pricing</Link>
          <div className="h-10 w-10 rounded-full bg-slate-600" />
        </div>
      </nav>
      <section className="flex h-full min-h-screen w-full max-w-[1210px] flex-col items-center justify-center p-5">
        <div className="-mt-20 flex w-full flex-col items-center gap-y-3">
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
      <footer className="flex w-full flex-col items-center border-t border-neutral-300">
        <div className="flex w-full max-w-[1210px] flex-row items-center justify-between p-3 text-sm">
          <p>© 2023 Magaaazine.</p>
          <p>Developed with 🧸 by VeoChoco.</p>
        </div>
      </footer>
    </main>
  );
}
