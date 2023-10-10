import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import SettingsList from "~/components/molecules/Lists/SettingsList";

export default async function Settings() {
  if (!cookies().has(`${process.env.COOKIE_NAME}`)) redirect("/signin");
  return <SettingsList />;
}
