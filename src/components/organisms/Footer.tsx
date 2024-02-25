import Link from "next/link";

export default function Footer() {
  return (
    <footer className="flex w-full flex-col items-center border-t border-neutral-300 dark:border-slate-700">
      <div className="flex w-full max-w-[1210px] flex-col-reverse items-center justify-between gap-y-2 p-3 text-[9px] md:flex-row md:gap-y-0 md:text-xs">
        <p className="w-full text-center md:text-left">© {new Date().getFullYear()} Magaaazine.</p>
        <div className="flex w-full flex-row items-center justify-center gap-x-3 md:gap-x-10">
          <Link href="/terms-and-conditions" className="hover:underline">
            Terms & Conditions
          </Link>
          <Link href="/privacy-policy" className="hover:underline">
            Privacy Policy
          </Link>
        </div>
        <p className="w-full text-center md:text-right">
          Developed with ❤️ by{" "}
          <Link
            href="https://www.jeromevillaruel.com"
            target="_blank"
            className="hover:underline"
          >
            Veoscript
          </Link>
          .
        </p>
      </div>
    </footer>
  );
}
