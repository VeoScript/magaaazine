"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import clsx from "clsx";
import toast from "react-hot-toast";

import { trpc } from "~/app/_trpc/client";

export default function SignUpForm() {
  const router = useRouter();

  const signUpMutation = trpc.signup.useMutation();

  const [isPending, setIsPending] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [repassword, setRepassword] = useState<string>("");

  const setDefault = () => {
    setName("");
    setEmail("");
    setPassword("");
    setRepassword("");
  };

  const handleSignUp = async (e: FormEvent) => {
    e.preventDefault();
    setIsPending(true);

    await signUpMutation.mutateAsync(
      {
        name,
        email,
        password,
        repassword,
      },
      {
        onSuccess: () => {
          setDefault();
          setIsPending(false);
          router.refresh();
        },
        onError: (error) => {
          setIsPending(false);
          toast.error(error.message);
        },
      },
    );
  };

  return (
    <form onSubmit={handleSignUp} className="flex w-full max-w-lg flex-col items-start gap-y-3">
      <h1 className="mb-1 ml-1.5 text-xl font-bold">Sign up</h1>
      <div className="flex w-full flex-col gap-y-1">
        <label htmlFor="name" className="ml-1.5 text-sm">
          Name
        </label>
        <input
          disabled={isPending}
          autoComplete="false"
          type="text"
          id="name"
          className={clsx(isPending && "cursor-not-allowed", "custom-input")}
          value={name}
          onChange={(e) => setName(e.currentTarget.value)}
        />
      </div>
      <div className="flex w-full flex-col gap-y-1">
        <label htmlFor="email" className="ml-1.5 text-sm">
          Email
        </label>
        <input
          disabled={isPending}
          autoComplete="false"
          type="text"
          id="email"
          className={clsx(isPending && "cursor-not-allowed", "custom-input")}
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
          className={clsx(isPending && "cursor-not-allowed", "custom-input")}
          value={password}
          onChange={(e) => setPassword(e.currentTarget.value)}
        />
      </div>
      <div className="flex w-full flex-col gap-y-1">
        <label htmlFor="repassword" className="ml-1.5 text-sm">
          Re-enter password
        </label>
        <input
          disabled={isPending}
          autoComplete="false"
          type="password"
          id="repassword"
          className={clsx(isPending && "cursor-not-allowed", "custom-input")}
          value={repassword}
          onChange={(e) => setRepassword(e.currentTarget.value)}
        />
      </div>
      <div className="flex w-full flex-row items-center justify-between gap-x-3">
        <span className="text-sm">
          Already have an account?{" "}
          <Link href="/signin" className="font-bold hover:underline">
            Sign in
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
