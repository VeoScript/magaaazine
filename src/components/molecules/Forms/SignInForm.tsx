"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import clsx from "clsx";
import toast from "react-hot-toast";

import { trpc } from "~/app/_trpc/client";

export default function SignInForm() {
  const router = useRouter();

  const signInMutation = trpc.signin.useMutation();

  const [isPending, setIsPending] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleSignIn = async (e: FormEvent) => {
    e.preventDefault();
    setIsPending(true);

    await signInMutation.mutateAsync(
      {
        email,
        password,
      },
      {
        onSuccess: (data) => {
          router.refresh();
          router.push(`/${data.username}`);
        },
        onError: (error) => {
          setIsPending(false);
          toast.error(error.message);
        },
      },
    );
  };

  return (
    <form onSubmit={handleSignIn} className="flex w-full max-w-lg flex-col items-start gap-y-3">
      <h1 className="mb-1 ml-1.5 text-xl font-bold">Sign in</h1>
      <div className="flex w-full flex-col gap-y-1">
        <label htmlFor="email" className="ml-1.5 text-sm">
          Email
        </label>
        <input
          disabled={isPending}
          autoComplete="false"
          type="text"
          id="email"
          className="custom-input"
          value={email}
          onChange={(e) => setEmail(e.currentTarget.value)}
        />
      </div>
      <div className="flex w-full flex-col gap-y-1">
        <label htmlFor="password" className="ml-1.5 text-sm">
          Password
        </label>
        <input
          disabled={isPending}
          autoComplete="false"
          type="password"
          id="password"
          className="custom-input"
          value={password}
          onChange={(e) => setPassword(e.currentTarget.value)}
        />
      </div>
      <div className="flex w-full flex-row items-center justify-between gap-x-3">
        <span className="text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-bold hover:underline">
            Sign up
          </Link>
        </span>
        <button
          disabled={isPending}
          type="submit"
          className={clsx(isPending && "opacity-50", "custom-button")}
        >
          {isPending ? "Loading..." : "Continue"}
        </button>
      </div>
    </form>
  );
}