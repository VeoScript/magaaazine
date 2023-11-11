"use client";

import clsx from "clsx";
import Link from "next/link";
import ActivityIndicator from "../atoms/ActivityIndicator";
import CopyClipboard from "../atoms/CopyClipboard";
import ChatBox from "./ChatBox";

import { trpc } from "~/app/_trpc/client";
import { serverClient } from "~/app/_trpc/serverClient";

interface ProfileMainHolderProps {
  profile: Awaited<ReturnType<(typeof serverClient)["profile"]>>;
}

export default function ProfileMainHolder({ profile }: ProfileMainHolderProps) {
  const { data: user, isLoading: isLoadingUser } = trpc.user.useQuery();

  return (
    <>
      {isLoadingUser ? (
        <div className="flex w-full flex-col items-center justify-center gap-y-3 rounded-lg bg-white bg-opacity-10 p-10 backdrop-blur-lg">
          <ActivityIndicator color="#FFF" className="h-10 w-10 text-white" />
          <p className="text-sm">Loading...</p>
        </div>
      ) : (
        <>
          {user?.id === profile?.id && (
            <div className="flex w-full flex-col items-center gap-y-3">
              <div
                className={clsx(
                  profile?.cover_photo ? "border-none" : "border",
                  "flex w-full max-w-full flex-row items-center justify-between gap-x-3 overflow-hidden rounded-lg bg-white bg-opacity-10 px-5 py-3 text-white backdrop-blur-lg md:max-w-sm",
                )}
              >
                <input
                  disabled
                  className={clsx(
                    profile?.cover_photo ? "text-white" : "text-black",
                    "w-full border-none bg-transparent text-xs outline-none md:text-sm",
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
