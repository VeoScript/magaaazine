import { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import SignUpForm from "~/components/molecules/Forms/SignUpForm";

export const metadata: Metadata = {
  title: "Magaaazine | Sign Up",
};

export default async function SignUp() {
  if ((await cookies()).has(`${process.env.COOKIE_NAME}`)) redirect("/");
  return <SignUpForm />;
}
