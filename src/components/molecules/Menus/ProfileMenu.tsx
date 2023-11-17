"use client";

import { useState, Fragment } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Verified from "~/components/atoms/Verified";
import * as Headless from "@headlessui/react";

import { trpc } from "~/app/_trpc/client";
import { serverClient } from "~/app/_trpc/serverClient";

interface ProfileMenuProps {
  user: Awaited<ReturnType<(typeof serverClient)["user"]>>;
  imageSrc: string;
  imageBlurUrl: string;
}

export default function ProfileMenu({ user, imageSrc, imageBlurUrl }: ProfileMenuProps) {
  const router = useRouter();

  const [isPending, setIsPending] = useState<boolean>(false);

  const { data: unreadMessages, isSuccess: isSuccessUnreadMessages } = trpc.countMessages.useQuery(
    undefined,
    {
      refetchInterval: 3000,
    },
  );

  const { data: unreadFilesImages, isSuccess: isSuccessUnreadFilesImages } =
    trpc.countFilesImages.useQuery(undefined, {
      refetchInterval: 3000,
    });

  const utils = trpc.useContext();
  const signOutMutation = trpc.signout.useMutation();

  const handleSignOut = async () => {
    setIsPending(true);
    await signOutMutation.mutateAsync(undefined, {
      onSettled: () => {
        utils.user.reset();
        utils.profile.reset({ username: user?.username as string });
        setIsPending(false);
        router.refresh();
      },
    });
  };

  return (
    <Headless.Menu as="div" className="relative inline-block text-left">
      <Headless.Menu.Button className="relative outline-none">
        {user?.profile_photo ? (
          <Image
            className="h-8 w-8 rounded-full bg-neutral-300 object-cover"
            src={imageSrc}
            alt="sea"
            priority
            width={500}
            height={500}
            quality={100}
            placeholder="blur"
            blurDataURL={imageBlurUrl}
          />
        ) : (
          <div className="flex h-8 w-8 flex-row items-center justify-center rounded-full bg-neutral-300 object-cover dark:bg-slate-700">
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
              className="h-5 w-5 text-white"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
        )}
        {((isSuccessUnreadMessages && unreadMessages != 0) ||
          (isSuccessUnreadFilesImages && unreadFilesImages != 0)) && (
          <div className="absolute right-0 top-0 h-3 w-3 rounded-full bg-red-500" />
        )}
      </Headless.Menu.Button>
      <Headless.Menu.Items className="divide-accent-3 absolute right-0 z-30 mt-5 flex w-56 origin-top-right flex-col divide-y divide-neutral-300 overflow-hidden rounded-lg bg-white shadow-xl outline-none dark:divide-slate-700 dark:bg-default-black">
        <Headless.Menu.Item as={Fragment}>
          <Link
            href={`/${user?.username}`}
            className="relative w-full overflow-hidden hover:opacity-80"
          >
            {user?.profile_photo ? (
              <Image
                className="aspect-square h-[10rem] w-full bg-center object-cover opacity-80"
                src={imageSrc}
                alt="sea"
                priority
                width={500}
                height={500}
                quality={100}
                placeholder="blur"
                blurDataURL={imageBlurUrl}
              />
            ) : (
              <div className="flex aspect-square h-[10rem] w-full flex-row items-center justify-center bg-neutral-300 object-cover dark:bg-slate-700" />
            )}
            <div className="absolute bottom-0 -mb-10 flex h-full w-full bg-gradient-to-t from-black from-15% to-transparent"></div>
            <div className="absolute inset-0 flex w-full flex-col items-center justify-center overflow-hidden p-3 text-center text-white">
              <div className="flex w-full flex-row flex-wrap items-center justify-center gap-x-1">
                <h3 className="text-base font-bold">{user?.name}</h3>
                {user?.is_verified && <Verified />}
              </div>
              <h6 className="text-sm font-medium">@{user?.username}</h6>
            </div>
          </Link>
        </Headless.Menu.Item>
        <Headless.Menu.Item as={Fragment}>
          <Link href="/" className="block w-full p-3 text-sm hover:opacity-80 md:hidden">
            Home
          </Link>
        </Headless.Menu.Item>
        <Headless.Menu.Item as={Fragment}>
          <Link href="/discover" className="block w-full p-3 text-sm hover:opacity-80 md:hidden">
            Discover
          </Link>
        </Headless.Menu.Item>
        <Headless.Menu.Item as={Fragment}>
          <Link
            href="/messages"
            className="flex w-full flex-row items-center justify-between p-3 text-sm hover:opacity-80"
          >
            <span>Messages</span>
            {isSuccessUnreadMessages && unreadMessages != 0 && (
              <p className="flex h-5 w-5 flex-row items-center justify-center rounded-full bg-red-500 text-[11px] text-white">
                <span>{unreadMessages}</span>
              </p>
            )}
          </Link>
        </Headless.Menu.Item>
        <Headless.Menu.Item as={Fragment}>
          <Link
            href="/files-images"
            className="flex w-full flex-row items-center justify-between p-3 text-sm hover:opacity-80"
          >
            <span>Files and Images</span>
            {isSuccessUnreadFilesImages && unreadFilesImages != 0 && (
              <p className="flex h-5 w-5 flex-row items-center justify-center rounded-full bg-red-500 text-[11px] text-white">
                <span>{unreadFilesImages}</span>
              </p>
            )}
          </Link>
        </Headless.Menu.Item>
        <Headless.Menu.Item as={Fragment}>
          <Link href="/pricing" className="block w-full p-3 text-sm hover:opacity-80 md:hidden">
            Pricing
          </Link>
        </Headless.Menu.Item>
        <Headless.Menu.Item as={Fragment}>
          <Link href="/settings" className="w-full p-3 text-sm hover:opacity-80">
            Settings
          </Link>
        </Headless.Menu.Item>
        <Headless.Menu.Item as={Fragment}>
          <button
            disabled={isPending}
            type="button"
            className="bg-accent-1 w-full p-3 text-left text-sm transition-all duration-200 ease-in-out hover:text-red-500"
            onClick={handleSignOut}
          >
            {isPending ? "Loading..." : "Sign out"}
          </button>
        </Headless.Menu.Item>
      </Headless.Menu.Items>
    </Headless.Menu>
  );
}
