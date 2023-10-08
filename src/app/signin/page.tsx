import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Magaaazine | Sign In",
};

export default function SignIn() {
  return (
    <form className="flex w-full max-w-lg flex-col items-start gap-y-3">
      <h1 className="mb-1 ml-1.5 text-xl font-bold">Sign in</h1>
      <div className="flex w-full flex-col gap-y-1">
        <label htmlFor="email" className="ml-1.5 text-sm">
          Email
        </label>
        <input type="text" id="email" className="custom-input" />
      </div>
      <div className="flex w-full flex-col gap-y-1">
        <label htmlFor="password" className="ml-1.5 text-sm">
          Password
        </label>
        <input type="password" id="password" className="custom-input" />
      </div>
      <div className="flex w-full flex-row items-center justify-between gap-x-3">
        <span className="text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-bold hover:underline">
            Sign up
          </Link>
        </span>
        <button type="submit" className="custom-button">
          Continue
        </button>
      </div>
    </form>
  );
}
