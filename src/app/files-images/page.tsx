import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import FilesImagesList from "~/components/molecules/Lists/FilesImagesList";

import { serverClient } from "../_trpc/serverClient";

export default async function FilesImages() {
  if (!cookies().has(`${process.env.COOKIE_NAME}`)) redirect("/signin");

  const filesImages = await serverClient.filesImages({
    cursor: "",
    search: "",
  });
  return <FilesImagesList initialData={filesImages} />;
}
