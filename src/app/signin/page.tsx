import { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import SignInForm from "~/components/molecules/Forms/SignInForm";

export const metadata: Metadata = {
  title: "Magaaazine | Sign In",
};

export default function SignIn() {
  if (cookies().has(`${process.env.COOKIE_NAME}`)) redirect("/");
  return <SignInForm />;
}
