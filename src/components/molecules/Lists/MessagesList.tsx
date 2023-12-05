"use client";

import { useState, useEffect, Fragment } from "react";
import { useInView } from "react-intersection-observer";
import clsx from "clsx";
import moment from "moment";
import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import Verified from "~/components/atoms/Verified";
import ActivityIndicator from "~/components/atoms/ActivityIndicator";

import { trpc } from "~/app/_trpc/client";
import { serverClient } from "~/app/_trpc/serverClient";

const AlertModal = dynamic(() => import("../Modals/AlertModal"));
const AlertModalDynamic = dynamic(() => import("../Modals/AlertModalDynamic"));
const MessagesListSkeletonLoader = dynamic(() => import("../Skeletons/MessagesListSkeletonLoader"));

interface MessagesListProps {
  userData: Awaited<ReturnType<(typeof serverClient)["user"]>>;
  initialData: Awaited<ReturnType<(typeof serverClient)["messages"]>> | any;
}

export default function MessagesList({ userData, initialData }: MessagesListProps) {
  const { ref, inView } = useInView();

  const [isPending, setIsPending] = useState<boolean>(false);
  const [isPendingDeleteAll, setIsPendingDeleteAll] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");

  const [indexIndicator, setIndexIndicator] = useState<number>(0);
  const [isOpenAlertModal, setIsOpenAlertModal] = useState<boolean>(false);
  const [isOpenAlertModalDynamic, setIsOpenAlertModalDynamic] = useState<boolean>(false);
  const [messageId, setMessageId] = useState<string>("");

  const { data: unreadMessages, isSuccess: isSuccessUnreadMessages } =
    trpc.countMessages.useQuery();

  const {
    data: messages,
    isLoading: isLoadingMessages,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = trpc.messages.useInfiniteQuery(
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
  const deleteMessageMutation = trpc.deleteMessage.useMutation();
  const deleteAllMessageMutation = trpc.deleteAllMessage.useMutation();
  const readMessageMutation = trpc.readMessage.useMutation({
    onSuccess: () => {
      utils.countMessages.invalidate();
      utils.messages.invalidate();
    },
  });
  const readAllMessagesMutation = trpc.readAllMessages.useMutation({
    onSuccess: () => {
      utils.countMessages.invalidate();
      utils.messages.invalidate();
    },
  });

  const handleDeleteMessage = async (id: string) => {
    setIsPending(true);
    await deleteMessageMutation.mutateAsync(
      {
        id,
      },
      {
        onError: () => {
          setIsPending(false);
        },
        onSuccess: () => {
          utils.countMessages.invalidate();
          utils.messages.invalidate();
          setMessageId("");
          setIsPending(false);
          setIsOpenAlertModalDynamic(false);
        },
      },
    );
  };

  const handleDeleteAllMessage = async () => {
    setIsPendingDeleteAll(true);
    await deleteAllMessageMutation.mutateAsync(
      {
        id: userData?.id as string,
      },
      {
        onError: () => {
          setIsPendingDeleteAll(false);
        },
        onSuccess: () => {
          utils.countMessages.invalidate();
          utils.messages.invalidate();
          setIsPendingDeleteAll(false);
          setIsOpenAlertModal(false);
        },
      },
    );
  };

  return (
    <>
      <div className="flex h-full w-full flex-col items-center overflow-y-auto">
        <div className="flex h-full w-full max-w-xl flex-col items-center gap-y-5 rounded-xl">
          <div className="sticky top-0 z-10 flex w-full flex-row items-start justify-between bg-white dark:bg-default-black">
            <div className="flex w-full flex-col items-start justify-center gap-y-5 px-3">
              <div className="flex w-full flex-col items-center justify-between md:flex-row">
                <h1 className="ml-0 py-3 text-center text-xl font-bold md:ml-3">Messages</h1>
                {messages && messages?.pages[0]?.messages.length != 0 && (
                  <div className="flex flex-row items-center gap-x-1">
                    {isSuccessUnreadMessages && unreadMessages != 0 && (
                      <button
                        type="button"
                        className="custom-button-outlined px-3 py-2 text-xs md:px-5 md:py-3"
                        onClick={() => readAllMessagesMutation.mutate()}
                      >
                        Mark all as read
                      </button>
                    )}
                    <button
                      type="button"
                      className="custom-button-outlined text-xs"
                      onClick={() => setIsOpenAlertModal(true)}
                    >
                      Clear all
                    </button>
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
                  id="search_messages"
                  placeholder="Search message content"
                  value={search}
                  onChange={(e) => setSearch(e.currentTarget.value)}
                />
              </div>
            </div>
          </div>
          <div className="mt-2 flex w-full flex-col items-start gap-y-10 px-3 pb-3">
            {isLoadingMessages || isPendingDeleteAll ? (
              <MessagesListSkeletonLoader />
            ) : (
              <>
                {messages && messages?.pages[0]?.messages.length == 0 && (
                  <div className="my-3 flex w-full flex-col items-center">
                    <p>No message found.</p>
                  </div>
                )}
                {messages &&
                  messages.pages.map((page, i) => (
                    <Fragment key={i}>
                      {page?.messages.map((message, index) => (
                        <div
                          key={index}
                          className="relative flex h-auto w-full flex-col items-center rounded-xl border border-neutral-300 p-5 dark:border dark:border-slate-700"
                        >
                          {!message.is_read && (
                            <button
                              title="Unread Message"
                              type="button"
                              className="absolute inset-0 z-20 flex h-full w-full flex-col items-center justify-center rounded-xl bg-neutral-200 bg-opacity-50 outline-none backdrop-blur-sm hover:bg-opacity-30 dark:bg-slate-900 dark:bg-opacity-50 dark:backdrop-blur-sm"
                              onClick={() => {
                                readMessageMutation.mutate({
                                  id: message.id,
                                });
                              }}
                            >
                              <div className="flex flex-row items-center justify-center overflow-hidden rounded-xl border-2 border-black bg-white p-3">
                                <Image
                                  priority
                                  src="/favicon.ico"
                                  className="object-cover"
                                  alt="favicon"
                                  width={35}
                                  height={35}
                                  quality={100}
                                />
                              </div>
                            </button>
                          )}
                          <button
                            disabled={isPending && indexIndicator === index}
                            type="button"
                            className={clsx(
                              isPending && indexIndicator === index
                                ? "cursor-not-allowed"
                                : "cursor-pointer",
                              "absolute right-3 top-3 outline-none",
                            )}
                            onClick={() => {
                              setIndexIndicator(index);
                              setMessageId(message.id);
                              setIsOpenAlertModalDynamic(true);
                            }}
                          >
                            {isPending && indexIndicator === index ? (
                              <ActivityIndicator className="h-4 w-4" />
                            ) : (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="h-4 w-4 text-black hover:text-opacity-50 dark:text-white"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            )}
                          </button>
                          {message.is_read && (
                            <>
                              {message.sender ? (
                                <Image
                                  priority
                                  src={message.sender.profile_photo as string}
                                  className="absolute -top-5 z-10 h-[5rem] w-[5rem] rounded-xl bg-black object-cover"
                                  alt="profile_image"
                                  width={100}
                                  height={100}
                                  quality={100}
                                />
                              ) : (
                                <div className="absolute -top-5 z-10 flex h-[5rem] w-[5rem] flex-row items-center justify-center rounded-xl bg-black object-cover">
                                  <svg
                                    stroke="currentColor"
                                    fill="currentColor"
                                    stroke-width="0"
                                    viewBox="0 0 24 24"
                                    className="h-6 w-6 text-white"
                                    height="1em"
                                    width="1em"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <g>
                                      <path fill="none" d="M0 0h24v24H0z"></path>
                                      <path d="M17 13a4 4 0 1 1 0 8c-2.142 0-4-1.79-4-4h-2a4 4 0 1 1-.535-2h3.07A3.998 3.998 0 0 1 17 13zM2 12v-2h2V7a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v3h2v2H2z"></path>
                                    </g>
                                  </svg>
                                </div>
                              )}
                            </>
                          )}
                          <div className="mt-[3rem] flex w-full flex-col items-center gap-y-3">
                            <div className="flex w-full flex-col items-center gap-y-1">
                              <Link
                                scroll={message.is_anonymous ? false : true}
                                href={!message.is_anonymous ? `/${message.sender?.username}` : ""}
                                className={clsx(
                                  message.is_anonymous ? "cursor-default" : "cursor-pointer",
                                  "flex flex-row items-center gap-x-1 text-sm font-semibold",
                                )}
                              >
                                <span>
                                  {message.is_anonymous
                                    ? "Anonymous"
                                    : `@${message.sender?.username}`}
                                </span>
                                {message.sender?.is_verified && <Verified />}
                              </Link>
                              {message.has_file && (
                                <Link
                                  href="/files-images"
                                  className="rounded-lg border border-blue-600 bg-blue-200 px-2 py-1 text-[10px] font-bold text-blue-900"
                                >
                                  uploaded something
                                </Link>
                              )}
                            </div>
                            <div className="flex w-full flex-col items-center gap-y-3">
                              <h2
                                className={clsx(
                                  !message.is_read && "line-clamp-2",
                                  "text-center text-xl font-bold text-neutral-800 dark:text-neutral-300",
                                )}
                              >
                                {message.content}
                              </h2>
                              <p className="text-xs text-neutral-500 dark:text-slate-500">
                                {moment(message.created_at).format("LLLL")}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </Fragment>
                  ))}
                <button
                  ref={ref}
                  className="-mt-5 flex w-full flex-col items-center justify-center space-y-2 text-white"
                  onClick={() => fetchNextPage()}
                  disabled={!hasNextPage || isFetchingNextPage}
                >
                  {isFetchingNextPage ? <MessagesListSkeletonLoader /> : hasNextPage ? "" : ""}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      <AlertModal
        title="Delete"
        message="Are you sure you want to delete all of your messages?"
        isPending={isPending}
        isOpen={isOpenAlertModal}
        setIsOpen={setIsOpenAlertModal}
        modalFunction={handleDeleteAllMessage}
      />
      <AlertModalDynamic
        title="Delete Message"
        message="Are you sure you want to delete this message?"
        isPending={isPendingDeleteAll}
        isOpen={isOpenAlertModalDynamic}
        setIsOpen={setIsOpenAlertModalDynamic}
        modalFunction={() => {
          handleDeleteMessage(messageId);
        }}
      />
    </>
  );
}
