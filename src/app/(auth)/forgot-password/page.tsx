import { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import dynamic from "next/dynamic";

const ForgotPasswordForm = dynamic(() => import("~/components/molecules/Forms/ForgotPasswordForm"));

export const metadata: Metadata = {
  title: "Magaaazine | Forgot Password?",
};

export default async function ForgotPassword() {
  if ((await cookies()).has(`${process.env.COOKIE_NAME}`)) redirect("/");
  return <ForgotPasswordForm />;
}
