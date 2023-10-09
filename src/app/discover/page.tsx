import DiscoverList from "~/components/molecules/Lists/DiscoverList";

import { serverClient } from "~/app/_trpc/serverClient";

export default async function Discover() {
  const usersData = await serverClient.users({
    cursor: "",
    search: "",
  });
  return <DiscoverList initialData={usersData} />;
}
