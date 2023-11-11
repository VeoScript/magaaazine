import dynamic from "next/dynamic";

import { serverClient } from "~/app/_trpc/serverClient";

const DiscoverList = dynamic(() => import("~/components/molecules/Lists/DiscoverList"));

export default async function Discover() {
  const usersData = await serverClient.users({
    cursor: "",
    search: "",
  });
  return <DiscoverList initialData={usersData} />;
}
