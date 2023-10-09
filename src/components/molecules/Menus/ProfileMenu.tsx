"use client";

import { useState, Fragment } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import * as Headless from "@headlessui/react";

import { trpc } from "~/app/_trpc/client";
import { serverClient } from "~/app/_trpc/serverClient";

interface ProfileMenu {
  user: Awaited<ReturnType<(typeof serverClient)["user"]>>;
  imageSrc: string;
  imageBlurUrl: string;
}

export default function ProfileMenu({ user, imageSrc, imageBlurUrl }: ProfileMenu) {
  const router = useRouter();

  const signOutMutation = trpc.signout.useMutation();

  const [isPending, setIsPending] = useState<boolean>(false);

  const handleSignOut = async () => {
    setIsPending(true);
    await signOutMutation.mutateAsync();
    setIsPending(false);
    router.refresh();
  };

  return (
    <Headless.Menu as="div" className="relative inline-block text-left">
      <Headless.Menu.Button className="outline-none">
        {user?.profile_photo ? (
          <Image
            className="h-8 w-8 rounded-full bg-slate-600 object-cover"
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
          <div className="flex h-8 w-8 flex-row items-center justify-center rounded-full bg-slate-600 object-cover">
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
      </Headless.Menu.Button>
      <Headless.Menu.Items className="divide-accent-3 absolute right-0 z-30 mt-2 flex w-56 origin-top-right flex-col divide-y overflow-hidden rounded-lg border bg-white outline-none">
        <Headless.Menu.Item as={Fragment}>
          <Link href={`/${user?.username}`} className="w-full p-3 text-sm hover:opacity-80">
            {user?.name}
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
