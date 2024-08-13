import dynamic from "next/dynamic";

const DiscoverList = dynamic(() => import("~/components/molecules/Lists/DiscoverList"));

export default async function Discover() {
  return <DiscoverList />;
}
