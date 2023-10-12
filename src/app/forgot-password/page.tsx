import { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import ForgotPasswordForm from "~/components/molecules/Forms/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Magaaazine | Forgot Password?",
};

export default function ForgotPassword() {
  if (cookies().has(`${process.env.COOKIE_NAME}`)) redirect("/");
  return <ForgotPasswordForm />;
}
