import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";

import getBase64 from "~/lib/functions/getBase64";
import SocialMediaHolder from "~/components/molecules/SocialMediaHolder";
import ChatBox from "~/components/molecules/ChatBox";
import ProfileUpload from "~/components/molecules/Uploads/ProfileUpload";
import CoverUpload from "~/components/molecules/Uploads/CoverUpload";

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
    description: "Empower Your Online Presence with Magaaazine",
    metadataBase: new URL(
      process.env.NODE_ENV === "development" ? `${process.env.DEV_URL}` : `${process.env.PROD_URL}`,
    ),
    openGraph: {
      type: "website",
      url:
        process.env.NODE_ENV === "development"
          ? `${process.env.DEV_URL}`
          : `${process.env.PROD_URL}`,
      title: `${profile?.name} | Magaaazine`,
      description: profile?.short_bio ?? "",
      siteName: "Magaaazine",
      images: [
        {
          url: profile?.profile_photo ?? "",
        },
      ],
    },
    twitter: {
      title: `${profile?.name} | Magaaazine`,
      description: profile?.short_bio ?? "",
      creator: profile?.name,
      site: "Magaaazine",
      images: [
        {
          url: profile?.profile_photo ?? "",
        },
      ],
    },
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
          <p className="w-full max-w-xl text-center text-base md:text-xl text-neutral-500">
            No user found from username <br />
            <span className="font-bold">&quot;{params.username}&quot;</span>.
          </p>
        </div>
      ) : (
        <div className="flex w-full flex-col items-center">
          {profile?.cover_photo && (
            <>
              <div className="fixed z-10 h-full w-full bg-black bg-opacity-50 backdrop-blur-sm" />
              <Image
                className="fixed h-full w-full object-cover"
                src={profile?.cover_photo}
                alt={profile?.username as string}
                priority
                width={500}
                height={500}
                quality={100}
                placeholder="blur"
                blurDataURL={await getBase64(profile?.cover_photo)}
              />
            </>
          )}
          {user?.id === profile.id && <CoverUpload />}
          <div
            className={clsx(
              profile?.cover_photo ? "text-white" : "text-black",
              "z-10 flex w-full flex-col items-center overflow-hidden p-5",
            )}
          >
            <div className="flex w-full max-w-xl flex-col items-center gap-y-5">
              <div className="relative">
                {profile?.profile_photo ? (
                  <Image
                    className="h-[13rem] w-[13rem] rounded-full object-cover"
                    src={profile?.profile_photo}
                    alt={profile?.username as string}
                    priority
                    width={500}
                    height={500}
                    quality={100}
                    placeholder="blur"
                    blurDataURL={await getBase64(profile?.profile_photo)}
                  />
                ) : (
                  <div className="flex h-[13rem] w-[13rem] flex-row items-center justify-center rounded-full bg-neutral-300 object-cover">
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
                {user?.id === profile.id && <ProfileUpload />}
              </div>
              <div className="flex w-full flex-col items-center gap-y-3">
                <div className="flex w-full flex-col items-center">
                  <h1 className="text-2xl font-bold">
                    {profile.is_display_name ? profile.name : `@${profile.username}`}
                  </h1>
                  {profile.is_display_name && (
                    <h2 className="text-base font-light">@{profile?.username}</h2>
                  )}
                </div>
                {(profile.facebook_link ||
                  profile.instagram_link ||
                  profile.twitterx_link ||
                  profile.linkedin_link ||
                  profile.github_link ||
                  profile.website_link) && (
                  <SocialMediaHolder
                    facebook_link={profile.facebook_link}
                    instagram_link={profile.instagram_link}
                    twitterx_link={profile.twitterx_link}
                    linkedin_link={profile.linkedin_link}
                    github_link={profile.github_link}
                    website_link={profile.website_link}
                  />
                )}
                {profile?.short_bio && (
                  <p
                    className={clsx(
                      profile.cover_photo ? "text-neutral-300" : "text-neutral-500",
                      "text-center text-lg",
                    )}
                  >
                    {profile?.short_bio}
                  </p>
                )}
              </div>
              {profile?.favorite_quote && (
                <q className="text-center text-base">{profile?.favorite_quote}</q>
              )}
              {user && user?.id === profile?.id && (
                <Link href="/settings" className="custom-button text-xs">
                  Edit your profile
                </Link>
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
