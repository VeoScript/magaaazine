import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import MessagesList from "~/components/molecules/Lists/MessagesList";

import { serverClient } from "../_trpc/serverClient";

export default async function Messages() {
  if (!cookies().has(`${process.env.COOKIE_NAME}`)) redirect("/signin");

  const userData = await serverClient.user();
  const messagesData = await serverClient.messages({
    cursor: "",
    search: "",
  });
  return <MessagesList userData={userData} initialData={messagesData} />;
}
