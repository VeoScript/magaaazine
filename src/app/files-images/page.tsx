import FilesImagesList from "~/components/molecules/Lists/FilesImagesList";

import { serverClient } from "../_trpc/serverClient";

export default async function FilesImages() {
  const userData = await serverClient.user();
  const filesImages = await serverClient.filesImages({
    cursor: "",
    search: "",
  });
  return <FilesImagesList userData={userData} initialData={filesImages} />;
}
