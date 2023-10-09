import { Metadata } from "next";
import clsx from "clsx";
import Image from "next/image";

import getBase64 from "~/lib/functions/getBase64";
import ChatBox from "~/components/molecules/ChatBox";

import { serverClient } from "../_trpc/serverClient";

export async function generateMetadata({
  params,
}: {
  params: { username: string };
}): Promise<Metadata> {
  const profile = await serverClient.profile({
    username: params.username ?? "",
  });

  return {
    title: `Magaaazine | ${profile ? `@${profile?.username}` : "Not Found"}`,
  };
}

export default async function UserPage({ params }: { params: { username: string } }) {
  const user = await serverClient.user();

  const profile = await serverClient.profile({
    username: params.username ?? "",
  });

  return (
    <>
      {!profile ? (
        <div className="flex h-full min-h-[35rem] w-full flex-col items-center justify-center">
          <p className="text-xl text-neutral-500">
            No user found from username{" "}
            <span className="font-bold">&quot;{params.username}&quot;</span>.
          </p>
        </div>
      ) : (
        <div className="flex h-full w-full flex-col items-center">
          {profile?.cover_photo && (
            <>
              <div className="absolute z-10 h-full w-full bg-black bg-opacity-50" />
              <div className="absolute h-full w-full">
                <Image
                  className="h-full w-full object-cover"
                  src={profile?.cover_photo}
                  alt="sea"
                  priority
                  width={500}
                  height={500}
                  quality={100}
                  placeholder="blur"
                  blurDataURL={await getBase64(profile?.cover_photo)}
                />
              </div>
            </>
          )}
          <div
            className={clsx(
              profile?.cover_photo ? "text-white" : "text-black",
              "absolute z-10 flex h-full w-full flex-col items-center overflow-y-auto p-5",
            )}
          >
            <div className="flex w-full max-w-xl flex-col items-center gap-y-5">
              {profile?.profile_photo ? (
                <Image
                  className="h-[13rem] w-[13rem] rounded-full object-cover"
                  src={profile?.profile_photo}
                  alt="sea"
                  priority
                  width={500}
                  height={500}
                  quality={100}
                  placeholder="blur"
                  blurDataURL={await getBase64(profile?.profile_photo)}
                />
              ) : (
                <div className="flex h-[13rem] w-[13rem] flex-row items-center justify-center rounded-full bg-slate-500 object-cover">
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
                    className="h-[8rem] w-[8rem] text-white"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
              )}
              <div className="flex w-full flex-col items-center gap-y-3">
                <div className="flex w-full flex-col items-center">
                  <h1 className="text-2xl font-bold">
                    {profile.is_display_name ? profile.name : `@${profile.username}`}
                  </h1>
                  {profile.is_display_name && (
                    <h2 className="text-base font-light">@{profile?.username}</h2>
                  )}
                </div>
                {profile?.short_bio && (
                  <p className="text-lg text-neutral-300">{profile?.short_bio}</p>
                )}
              </div>
              {profile?.favorite_quote && (
                <q className="text-center text-base">{profile?.favorite_quote}</q>
              )}
              {user?.id !== profile?.id && (
                <ChatBox
                  isAuth={user ? true : false}
                  hasCoverPhoto={profile?.cover_photo ? true : false}
                  receiveFilesAnonymous={profile.is_receive_files_anonymous}
                  receiveImageAnonymous={profile.is_receive_images_anonymous}
                  senderId={user?.id ?? ""}
                  receiverId={profile?.id}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}