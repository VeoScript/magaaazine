import MessagesList from "~/components/molecules/Lists/MessagesList";

import { serverClient } from "../_trpc/serverClient";

export default async function Messages() {
  const userData = await serverClient.user();
  const messagesData = await serverClient.messages({
    cursor: "",
    search: "",
  });
  return <MessagesList userData={userData} initialData={messagesData} />;
}
