"use client";

import clsx from "clsx";
import dynamic from "next/dynamic";
import Link from "next/link";
import ActivityIndicator from "../atoms/ActivityIndicator";

import { trpc } from "~/app/_trpc/client";
import { serverClient } from "~/app/_trpc/serverClient";

const CopyClipboard = dynamic(() => import("../atoms/CopyClipboard"));
const ChatBox = dynamic(() => import("./ChatBox"));

interface ProfileMainHolderProps {
  profile: Awaited<ReturnType<(typeof serverClient)["profile"]>>;
}

export default function ProfileMainHolder({ profile }: ProfileMainHolderProps) {
  const { data: user, isLoading: isLoadingUser } = trpc.user.useQuery(undefined, {
    gcTime: 0,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });

  return (
    <>
      {isLoadingUser ? (
        <div
          className={clsx(
            profile?.cover_photo
              ? "bg-white/10 dark:bg-default-black/50"
              : "bg-black/10 dark:bg-default-black/50",
            "flex w-full flex-col items-center justify-center gap-y-3 rounded-xl p-10 backdrop-blur-lg dark:backdrop-blur-lg",
          )}
        >
          <ActivityIndicator
            color={profile?.cover_photo ? "#FFF" : "#657487"}
            className="h-10 w-10 text-white"
          />
          <p className="text-sm">Loading...</p>
        </div>
      ) : (
        <>
          {user?.id === profile?.id && (
            <div className="flex w-full flex-col items-center gap-y-5">
              <div
                className={clsx(
                  profile?.cover_photo ? "border-none" : "border",
                  "flex w-full max-w-full flex-row items-center justify-between gap-x-3 overflow-hidden rounded-lg bg-white/10 px-5 py-3 text-white backdrop-blur-lg md:max-w-lg md:py-5 dark:bg-default-black/10 dark:backdrop-blur-lg",
                )}
              >
                <input
                  disabled
                  className={clsx(
                    profile?.cover_photo ? "text-white" : "text-black dark:text-white",
                    "w-full border-none bg-transparent text-sm outline-none md:text-base",
                  )}
                  type="text"
                  value={`${String(process.env.PROD_URL).replace(
                    /https:\/\/(www\.)?/,
                    "",
                  )}/${profile?.username}`}
                />
                <CopyClipboard
                  textToCopy={`${String(process.env.PROD_URL).replace(
                    /https:\/\/(www\.)?/,
                    "",
                  )}/${profile?.username}`}
                />
              </div>
              <Link href="/settings" className="custom-button text-xs">
                Edit your profile
              </Link>
            </div>
          )}
          {user?.id !== profile?.id && (
            <ChatBox
              isAuth={user ? true : false}
              hasCoverPhoto={profile?.cover_photo ? true : false}
              receiveFilesAnonymous={profile?.is_receive_files_anonymous as boolean}
              receiveImageAnonymous={profile?.is_receive_images_anonymous as boolean}
              senderId={user?.id ?? ""}
              receiverId={profile?.id as string}
            />
          )}
        </>
      )}
    </>
  );
}
