"use client";

import { useState, useEffect, Fragment } from "react";
import { useInView } from "react-intersection-observer";
import Link from "next/link";
import Image from "next/legacy/image";
import dynamic from "next/dynamic";
import clsx from "clsx";
import moment from "moment";
import Verified from "~/components/atoms/Verified";
import ActivityIndicator from "~/components/atoms/ActivityIndicator";

import { trpc } from "~/app/_trpc/client";
import { serverClient } from "~/app/_trpc/serverClient";
import { deleteImage } from "~/lib/functions/deleteImage";

const ViewImageModal = dynamic(() => import("../Modals/ViewImageModal"));
const AlertModal = dynamic(() => import("../Modals/AlertModal"));
const AlertModalDynamic = dynamic(() => import("../Modals/AlertModalDynamic"));
const FilesImagesListSkeletonLoader = dynamic(
  () => import("../Skeletons/FilesImagesListSkeletonLoader"),
);

interface FilesImagesListProps {
  initialData: Awaited<ReturnType<(typeof serverClient)["filesImages"]>> | any;
}

export default function FilesImagesList({ initialData }: FilesImagesListProps) {
  const { ref, inView } = useInView();

  const [isPending, setIsPending] = useState<boolean>(false);
  const [isPendingDeleteAll, setIsPendingDeleteAll] = useState<boolean>(false);
  const [indexIndicator, setIndexIndicator] = useState<number>(0);
  const [search, setSearch] = useState<string>("");

  const [isOpenViewImageModal, setIsOpenViewImageModal] = useState<boolean>(false);
  const [isOpenAlertModal, setIsOpenAlertModal] = useState<boolean>(false);
  const [isOpenAlertModalDynamic, setIsOpenAlertModalDynamic] = useState<boolean>(false);
  const [fileImageUrl, setFileImageUrl] = useState<string>("");
  const [fileImageName, setFileImageName] = useState<string>("");
  const [fileImageId, setFileImageId] = useState<string>("");
  const [fileImageType, setFileImageType] = useState<"IMAGE" | "FILE">("IMAGE");
  const [fileImageDeleteURL, setFileImageDeleteURL] = useState<string>("");

  const { data: unreadFilesImages, isSuccess: isSuccessUnreadFilesImages } =
    trpc.countFilesImages.useQuery();

  const { data: allFiles, isLoading: isLoadingAllFiles } = trpc.allFilesImages.useQuery();

  const {
    data: filesImages,
    isLoading: isLoadingFilesImages,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = trpc.filesImages.useInfiniteQuery(
    {
      limit: 30,
      search,
    },
    {
      initialData: () => {
        const data = initialData;
        if (data) {
          return {
            pageParams: [undefined],
            pages: [data],
          };
        }
      },
      cacheTime: 0,
      getNextPageParam: (lastPage) => lastPage?.nextCursor,
    },
  );

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, inView]);

  const utils = trpc.useContext();
  const deleteFileMutation = trpc.deleteFileImage.useMutation();
  const deleteAllFilesMutation = trpc.deleteAllFilesImages.useMutation();
  const readFileImageMutation = trpc.readFileImage.useMutation({
    onSuccess: () => {
      utils.countFilesImages.invalidate();
      utils.filesImages.invalidate();
      utils.allFilesImages.invalidate();
    },
  });
  const readAllFilesImagesMutation = trpc.readAllFilesImages.useMutation({
    onSuccess: () => {
      utils.countFilesImages.invalidate();
      utils.filesImages.invalidate();
      utils.allFilesImages.invalidate();
    },
  });

  const handleDeleteFileImage = async (id: string, type: "IMAGE" | "FILE", delete_url: string) => {
    setIsPending(true);
    await deleteFileMutation.mutateAsync(
      {
        id,
        type,
        delete_url,
      },
      {
        onError: () => {
          setIsPending(false);
        },
        onSuccess: () => {
          if (type === "IMAGE") {
            // this function will delete the image from IMGUR server...
            deleteImage({
              deleteHash: delete_url,
            });
          }
          utils.countFilesImages.invalidate();
          utils.filesImages.invalidate();
          utils.allFilesImages.invalidate();
          setIsPending(false);
          setIsOpenAlertModalDynamic(false);
        },
      },
    );
  };

  const handleDeleteAllFilesImages = async () => {
    setIsPendingDeleteAll(true);
    if (allFiles) {
      await deleteAllFilesMutation.mutateAsync(
        {
          allFiles: allFiles,
          files: allFiles.map((file) => file.delete_url),
        },
        {
          onError: () => {
            setIsPendingDeleteAll(false);
          },
          onSuccess: () => {
            if (allFiles) {
              for (const image of allFiles) {
                if (image.type === "IMAGE") {
                  // this function will delete the image from IMGUR server...
                  deleteImage({
                    deleteHash: image.delete_url as string,
                  });
                }
              }
            }
            utils.countFilesImages.invalidate();
            utils.filesImages.invalidate();
            utils.allFilesImages.invalidate();
            setIsPendingDeleteAll(false);
            setIsOpenAlertModal(false);
          },
        },
      );
    }
  };

  return (
    <>
      <div className="flex h-full w-full flex-col items-center overflow-y-auto">
        <div className="flex h-full w-full max-w-xl flex-col items-center rounded-xl">
          <div className="sticky top-0 z-10 flex w-full flex-row items-start justify-between bg-white dark:bg-default-black">
            <div className="flex w-full flex-col items-start justify-center gap-y-5 p-3">
              <div className="flex w-full flex-col items-center justify-between md:flex-row">
                <h1 className="ml-0 py-3 text-center text-xl font-bold md:ml-3">Files & Images</h1>
                {filesImages && filesImages?.pages[0]?.filesImages.length != 0 && (
                  <div className="flex flex-row items-center gap-x-1">
                    <button
                      type="button"
                      className="custom-button-outlined text-xs font-semibold"
                      onClick={() => setIsOpenAlertModal(true)}
                    >
                      Clear all
                    </button>
                    {isSuccessUnreadFilesImages && unreadFilesImages != 0 && (
                      <button
                        type="button"
                        className="custom-button-outlined text-xs font-semibold"
                        onClick={() => readAllFilesImagesMutation.mutate()}
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>
                )}
              </div>
              <div className="custom-input flex w-full flex-row items-center gap-x-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-5 w-5 text-neutral-400"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                  />
                </svg>
                <input
                  className="w-full bg-transparent outline-none"
                  autoComplete="off"
                  type="text"
                  id="search_files_images"
                  placeholder="Search files by name"
                  value={search}
                  onChange={(e) => setSearch(e.currentTarget.value)}
                />
              </div>
            </div>
          </div>
          <div className="flex w-full flex-col items-start gap-y-1 px-3 pb-3">
            {isLoadingFilesImages || isLoadingAllFiles || isPendingDeleteAll ? (
              <FilesImagesListSkeletonLoader />
            ) : (
              <>
                {filesImages && filesImages?.pages[0]?.filesImages.length == 0 && (
                  <div className="my-3 flex w-full flex-col items-center">
                    <p>No files/images found.</p>
                  </div>
                )}
                {filesImages &&
                  filesImages.pages.map((page, i) => (
                    <Fragment key={i}>
                      {page?.filesImages.map((filesImage, index) => (
                        <div
                          key={filesImage.id}
                          className="relative flex w-full cursor-default flex-row items-start gap-x-2 overflow-hidden rounded-xl border p-3 transition duration-100 hover:bg-opacity-50 dark:border dark:border-slate-700"
                        >
                          {!filesImage.is_read && (
                            <button
                              title="Unread Message"
                              type="button"
                              className="absolute inset-0 z-20 flex h-full w-full flex-col items-center justify-center rounded-xl bg-neutral-200 bg-opacity-50 outline-none backdrop-blur-sm hover:bg-opacity-30 dark:bg-slate-900 dark:bg-opacity-50 dark:backdrop-blur-sm"
                              onClick={() =>
                                readFileImageMutation.mutate({
                                  id: filesImage.id,
                                })
                              }
                            >
                              <div className="flex flex-row items-center justify-center overflow-hidden rounded-xl border-2 border-black bg-white p-3">
                                <Image
                                  priority
                                  src="/favicon.ico"
                                  className="object-cover"
                                  alt="favicon"
                                  width={30}
                                  height={30}
                                  quality={100}
                                />
                              </div>
                            </button>
                          )}
                          <div className="flex flex-row items-start gap-x-3">
                            {filesImage.type === "FILE" && (
                              <div className="flex h-[3rem] w-[3rem] flex-row items-center justify-center rounded-md bg-black object-cover">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="h-6 w-6 text-white"
                                >
                                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                                </svg>
                              </div>
                            )}
                            {filesImage.type === "IMAGE" && (
                              <Image
                                priority
                                src={filesImage.url}
                                className="h-6 w-6 rounded-md object-cover"
                                alt="profile_image"
                                width={50}
                                height={50}
                                quality={100}
                                placeholder="blur"
                                blurDataURL={filesImage.url}
                              />
                            )}
                            <div className="flex max-w-sm flex-1 flex-col items-start gap-y-3">
                              {filesImage.is_anonymous ? (
                                <p className="text-sm font-semibold">Anonymous</p>
                              ) : (
                                <Link
                                  href={`/${filesImage.sender?.username}`}
                                  className="flex flex-row items-center gap-x-1 text-sm font-semibold text-black hover:underline dark:text-white"
                                >
                                  <span>@{filesImage.sender?.username}</span>
                                  {filesImage.sender?.is_verified && <Verified />}
                                </Link>
                              )}
                              <h3 className="truncate-text text-sm">Filename: {filesImage.name}</h3>
                              <p className="text-xs text-neutral-500 dark:text-slate-500">
                                {moment(filesImage.created_at).format("LLLL")}
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-1 flex-row items-center justify-end gap-x-2">
                            {filesImage.type === "IMAGE" ? (
                              <button
                                type="button"
                                className="outline-none"
                                onClick={() => {
                                  setFileImageUrl(filesImage.url);
                                  setIsOpenViewImageModal(true);
                                }}
                              >
                                <svg
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth={1.5}
                                  viewBox="0 0 24 24"
                                  xmlns="http://www.w3.org/2000/svg"
                                  aria-hidden="true"
                                  className="h-5 w-5 hover:text-blue-400"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                                  />
                                </svg>
                              </button>
                            ) : (
                              <Link href={filesImage.url} target="_blank">
                                <svg
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth={1.5}
                                  viewBox="0 0 24 24"
                                  xmlns="http://www.w3.org/2000/svg"
                                  aria-hidden="true"
                                  className="h-5 w-5 hover:text-blue-400"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                                  />
                                </svg>
                              </Link>
                            )}
                            <button
                              disabled={isPending && indexIndicator === index}
                              type="button"
                              className={clsx(
                                isPending && indexIndicator === index
                                  ? "cursor-not-allowed"
                                  : "cursor-pointer",
                                "outline-none",
                              )}
                              onClick={() => {
                                setIndexIndicator(index);
                                setFileImageName(filesImage.name);
                                setFileImageId(filesImage.id);
                                setFileImageType(filesImage.type);
                                setFileImageDeleteURL(filesImage.delete_url as string);
                                setIsOpenAlertModalDynamic(true);
                              }}
                            >
                              {isPending && indexIndicator === index ? (
                                <ActivityIndicator className="h-5 w-5" />
                              ) : (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth={1.5}
                                  stroke="currentColor"
                                  className="h-5 w-5 text-black hover:text-opacity-50 dark:text-white"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M6 18L18 6M6 6l12 12"
                                  />
                                </svg>
                              )}
                            </button>
                          </div>
                        </div>
                      ))}
                    </Fragment>
                  ))}
                <button
                  ref={ref}
                  className="flex w-full flex-col items-center justify-center space-y-2"
                  onClick={() => fetchNextPage()}
                  disabled={!hasNextPage || isFetchingNextPage}
                >
                  {isFetchingNextPage ? <FilesImagesListSkeletonLoader /> : hasNextPage ? "" : ""}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      <AlertModal
        title="Delete"
        message="Are you sure you want to delete all of your files and images?"
        isPending={isPending}
        isOpen={isOpenAlertModal}
        setIsOpen={setIsOpenAlertModal}
        modalFunction={handleDeleteAllFilesImages}
      />
      <AlertModalDynamic
        title="Delete File"
        message={`Are you sure you want to delete this file? ${fileImageName.substring(0, 20)}...`}
        isPending={isPendingDeleteAll}
        isOpen={isOpenAlertModalDynamic}
        setIsOpen={setIsOpenAlertModalDynamic}
        modalFunction={() => {
          handleDeleteFileImage(fileImageId, fileImageType, fileImageDeleteURL);
        }}
      />
      <ViewImageModal
        imageUrl={fileImageUrl}
        isOpen={isOpenViewImageModal}
        setIsOpen={setIsOpenViewImageModal}
        setImageUrl={() => setFileImageUrl("")}
      />
    </>
  );
}
