import { Metadata } from "next";
import Link from "next/link";
import DefaultLayout from "~/components/templates/DefaultLayout";

export const metadata: Metadata = {
  title: "Magaaazine | Sign Up",
};

export default function SignUp() {
  return (
    <form className="flex w-full max-w-lg flex-col items-start gap-y-3">
      <h1 className="mb-1 ml-1.5 text-xl font-bold">Sign up</h1>
      <div className="flex w-full flex-col gap-y-1">
        <label htmlFor="name" className="ml-1.5 text-sm">
          Name
        </label>
        <input type="text" id="name" className="custom-input" />
      </div>
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
      <div className="flex w-full flex-col gap-y-1">
        <label htmlFor="repassword" className="ml-1.5 text-sm">
          Re-enter password
        </label>
        <input type="password" id="repassword" className="custom-input" />
      </div>
      <div className="flex w-full flex-row items-center justify-between gap-x-3">
        <span className="text-sm">
          Already have an account?{" "}
          <Link href="/signin" className="font-bold hover:underline">
            Sign in
          </Link>
        </span>
        <button type="submit" className="custom-button">
          Continue
        </button>
      </div>
    </form>
  );
}
