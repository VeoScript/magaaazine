import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import SettingsForm from "~/components/molecules/Forms/SettingsForm";

export default async function Settings() {
  if (!cookies().has(`${process.env.COOKIE_NAME}`)) redirect("/signin");
  return <SettingsForm />;
}
