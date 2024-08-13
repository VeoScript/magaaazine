import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { decode } from "jwt-simple";

import ResetPasswordForm from "~/components/molecules/Forms/ResetPasswordForm";

export default function ResetPasswordToken({ params }: { params: { token: string } }) {
  if (cookies().has(`${process.env.COOKIE_NAME}`)) redirect("/");
  return <ResetPasswordForm token={params.token} />;
}
