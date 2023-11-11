"use client";

import { useState, useEffect, Fragment } from "react";
import { useRouter } from "next/navigation";
import { useInView } from "react-intersection-observer";
import clsx from "clsx";
import moment from "moment";
import Link from "next/link";
import Image from "next/image";
import AlertModal from "../Modals/AlertModal";
import AlertModalDynamic from "../Modals/AlertModalDynamic";
import ActivityIndicator from "~/components/atoms/ActivityIndicator";

import { trpc } from "~/app/_trpc/client";
import { serverClient } from "~/app/_trpc/serverClient";

interface MessagesListProps {
  userData: Awaited<ReturnType<(typeof serverClient)["user"]>>;
  initialData: Awaited<ReturnType<(typeof serverClient)["messages"]>> | any;
}

export default function MessagesList({ userData, initialData }: MessagesListProps) {
  const router = useRouter();

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
        <div className="flex h-full w-full max-w-xl flex-col items-center rounded-xl">
          <div className="sticky top-0 z-10 flex w-full flex-row items-start justify-between bg-white">
            <div className="flex w-full flex-col items-start justify-center gap-y-5 p-3">
              <div className="flex w-full flex-col items-center justify-between md:flex-row">
                <h1 className="ml-0 py-3 text-center text-xl font-bold md:ml-3">Messages</h1>
                {messages && messages?.pages[0]?.messages.length != 0 && (
                  <div className="flex flex-row items-center gap-x-1">
                    <button
                      type="button"
                      className="custom-button-outlined text-xs font-semibold"
                      onClick={() => setIsOpenAlertModal(true)}
                    >
                      Clear all
                    </button>
                    {isSuccessUnreadMessages && unreadMessages != 0 && (
                      <button
                        type="button"
                        className="custom-button-outlined text-xs font-semibold"
                        onClick={() => readAllMessagesMutation.mutate()}
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
                  id="search_messages"
                  placeholder="Search message content"
                  value={search}
                  onChange={(e) => setSearch(e.currentTarget.value)}
                />
              </div>
            </div>
          </div>
          <div className="flex w-full flex-col items-start gap-y-1 px-3 pb-3">
            {isLoadingMessages || isPendingDeleteAll ? (
              <div className="my-3 flex w-full flex-col items-center">
                <ActivityIndicator color="#333" className="h-8 w-8 text-black" />
              </div>
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
                          key={message.id}
                          className={clsx(
                            !message.is_read && "bg-neutral-200 hover:bg-opacity-80",
                            "flex w-full cursor-default flex-row items-start gap-x-2 rounded-xl border p-3 transition duration-100 hover:bg-opacity-50",
                          )}
                        >
                          {message.sender ? (
                            <Image
                              priority
                              src={message.sender.profile_photo as string}
                              className="h-[3rem] w-[3rem] rounded-full bg-black object-cover"
                              alt="profile_image"
                              width={100}
                              height={100}
                              quality={100}
                            />
                          ) : (
                            <div className="flex h-[3rem] w-[3rem] flex-row items-center justify-center rounded-full bg-black object-cover">
                              <svg
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={1.5}
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                                aria-hidden="true"
                                className="h-6 w-6 text-white"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                                />
                              </svg>
                            </div>
                          )}
                          <div className="flex flex-1 flex-col items-start gap-y-1">
                            <div className="flex w-full flex-row items-center justify-between">
                              <div className="flex flex-col items-start justify-start gap-x-0 gap-y-1 md:flex-row md:items-center md:gap-x-3 md:gap-y-0">
                                <Link
                                  scroll={false}
                                  href={!message.is_anonymous ? `/${message.sender?.username}` : ""}
                                  className={clsx(
                                    message.is_anonymous ? "cursor-default" : "cursor-pointer",
                                    "text-base font-bold",
                                  )}
                                  onClick={() => {
                                    readMessageMutation.mutate({
                                      id: message.id,
                                    });
                                  }}
                                >
                                  {message.is_anonymous
                                    ? "Anonymous"
                                    : `@${message.sender?.username}`}
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
                                  setMessageId(message.id);
                                  setIsOpenAlertModalDynamic(true);
                                }}
                              >
                                {isPending && indexIndicator === index ? (
                                  <ActivityIndicator color="#000" className="h-4 w-4" />
                                ) : (
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="h-4 w-4 text-black hover:text-opacity-50"
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
                            <h2 className="text-base text-neutral-800">{message.content}</h2>
                            <p className="text-xs text-neutral-500">
                              {moment(message.created_at).format("LLLL")}
                            </p>
                          </div>
                        </div>
                      ))}
                    </Fragment>
                  ))}
                <button
                  ref={ref}
                  className="flex w-full flex-col items-center justify-center space-y-2 text-white"
                  onClick={() => fetchNextPage()}
                  disabled={!hasNextPage || isFetchingNextPage}
                >
                  {isFetchingNextPage ? (
                    <ActivityIndicator color="#333" className="h-8 w-8" />
                  ) : hasNextPage ? (
                    ""
                  ) : (
                    ""
                  )}
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
