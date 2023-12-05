"use client";

import { useState, useEffect, Fragment } from "react";
import { useInView } from "react-intersection-observer";
import dynamic from "next/dynamic";
import clsx from "clsx";
import Link from "next/link";
import Image from "next/legacy/image";
import Verified from "~/components/atoms/Verified";

const DiscoverListSkeletonLoader = dynamic(() => import("../Skeletons/DiscoverListSkeletonLoader"));

import { trpc } from "~/app/_trpc/client";

export default function DiscoverList() {
  const { ref, inView } = useInView();

  const [search, setSearch] = useState<string>("");

  const {
    data: users,
    isLoading: isLoadingUsers,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = trpc.users.useInfiniteQuery(
    {
      limit: 10,
      search,
    },
    {
      // initialData: () => {
      //   const data = initialData;
      //   if (data) {
      //     return {
      //       pageParams: [undefined],
      //       pages: [data],
      //     };
      //   }
      // },
      // refetchOnMount: false,
      // refetchOnReconnect: false,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, inView]);

  return (
    <div className="flex h-full w-full flex-col items-center overflow-y-auto">
      <div className="flex h-full w-full max-w-xl flex-col items-center rounded-xl">
        <div className="sticky top-0 z-10 flex w-full flex-row items-start justify-between">
          <div className="flex w-full flex-col items-start justify-center gap-y-5 p-3">
            <div className="flex w-full flex-row items-center justify-center">
              <label htmlFor="search_people" className="ml-3 text-center text-xl font-bold">
                Discover
              </label>
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
                id="search_people"
                placeholder="Search people"
                value={search}
                onChange={(e) => setSearch(e.currentTarget.value)}
              />
            </div>
          </div>
        </div>
        <div className="flex w-full flex-col items-start gap-y-1 px-3 pb-3">
          {isLoadingUsers ? (
            <DiscoverListSkeletonLoader />
          ) : (
            <>
              {users && users.pages[0].users.length == 0 && (
                <div className="my-3 flex w-full flex-col items-center">
                  <p>No user found.</p>
                </div>
              )}
              {users &&
                users.pages.map((page, i) => (
                  <Fragment key={i}>
                    {page.users.map((user) => (
                      <Link
                        key={user.id}
                        href={`/${user.username}`}
                        className="relative flex w-full flex-row items-center gap-x-3 overflow-hidden rounded-xl border bg-white bg-opacity-80 bg-center bg-no-repeat px-3 py-2 backdrop-blur-sm transition duration-100 hover:opacity-80 dark:border dark:border-slate-700 dark:bg-default-black"
                      >
                        {user.cover_photo && (
                          <>
                            <div className="absolute inset-0 z-10 h-full w-full rounded-xl bg-black bg-opacity-10 backdrop-blur-sm" />
                            <div className="absolute inset-0 h-full w-full overflow-hidden">
                              <Image
                                priority
                                src={user.cover_photo}
                                className="h-full w-full object-cover"
                                alt="profile_image"
                                objectFit="cover"
                                layout="fill"
                                quality={100}
                                placeholder="blur"
                                blurDataURL={user.cover_photo}
                              />
                            </div>
                          </>
                        )}
                        {user.profile_photo ? (
                          <div className="z-10 flex h-[6rem] w-[6rem] overflow-hidden rounded-full">
                            <Image
                              priority
                              src={user.profile_photo}
                              className="object-cover"
                              alt="profile_image"
                              width={100}
                              height={100}
                              quality={100}
                              placeholder="blur"
                              blurDataURL={user.profile_photo}
                            />
                          </div>
                        ) : (
                          <div className="z-10 flex h-[6rem] w-[6rem] flex-row items-center justify-center rounded-full bg-neutral-300 object-cover dark:bg-slate-700">
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
                              className="h-10 w-10 text-white"
                            >
                              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                              <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                          </div>
                        )}
                        <div className="z-10 flex flex-col">
                          <span className="flex flex-row items-center justify-start gap-x-1">
                            <h1
                              className={clsx(
                                user.cover_photo ? "text-white" : "text-black dark:text-white",
                                "text-sm font-bold",
                              )}
                            >
                              {user.name}
                            </h1>
                            {user.is_verified && <Verified />}
                          </span>
                          <h2
                            className={clsx(
                              user.cover_photo
                                ? "text-neutral-300"
                                : "text-black dark:text-neutral-300",
                              "text-xs",
                            )}
                          >
                            @{user.username}
                          </h2>
                        </div>
                      </Link>
                    ))}
                  </Fragment>
                ))}
              <button
                ref={ref}
                className="flex w-full flex-col items-center justify-center space-y-2 text-white"
                onClick={() => fetchNextPage()}
                disabled={!hasNextPage || isFetchingNextPage}
              >
                {isFetchingNextPage ? <DiscoverListSkeletonLoader /> : hasNextPage ? "" : ""}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
