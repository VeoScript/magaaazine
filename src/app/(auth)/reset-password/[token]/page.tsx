import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { decode } from "jwt-simple";

import ResetPasswordForm from "~/components/molecules/Forms/ResetPasswordForm";

export default async function ResetPasswordToken({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  if ((await cookies()).has(`${process.env.COOKIE_NAME}`)) redirect("/");
  const { token } = await params;
  return <ResetPasswordForm token={token} />;
}
