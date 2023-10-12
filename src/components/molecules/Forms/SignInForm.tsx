"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import clsx from "clsx";

import { trpc } from "~/app/_trpc/client";
import { myToast } from "~/components/atoms/MyToast";
import { signinValidation } from "~/lib/hooks/useValidation";

export default function SignInForm() {
  const router = useRouter();

  const signInMutation = trpc.signin.useMutation();

  const [isPending, setIsPending] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [signInFormErrors, setSignInFormErrors] = useState<any>(null);

  const handleSignIn = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await signinValidation.validate({ email, password }, { abortEarly: false });

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
            myToast({
              type: "error",
              message: error.message,
            });
          },
        },
      );
    } catch (error: any) {
      if (error?.inner) {
        const errors: any = {};
        error.inner.forEach((e: any) => {
          errors[e.path] = e.message;
        });
        setSignInFormErrors(errors);
      }
    }
  };

  return (
    <form
      onSubmit={handleSignIn}
      className="flex w-full max-w-lg flex-col items-start gap-y-3 p-5 md:p-0"
    >
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
          onChange={(e) => {
            setSignInFormErrors(null);
            setEmail(e.currentTarget.value);
          }}
        />
        {signInFormErrors && signInFormErrors.email && (
          <span className="ml-2 mt-1 text-xs font-medium text-red-500">
            {signInFormErrors.email}
          </span>
        )}
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
          onChange={(e) => {
            setSignInFormErrors(null);
            setPassword(e.currentTarget.value);
          }}
        />
        {signInFormErrors && signInFormErrors.password && (
          <span className="ml-2 mt-1 text-xs font-medium text-red-500">
            {signInFormErrors.password}
          </span>
        )}
      </div>
      <div className="flex w-full flex-col items-center gap-y-3">
        <Link href="/forgot-password" className="text-sm hover:underline">
          Forgot Password?
        </Link>
        <button
          disabled={isPending}
          type="submit"
          className={clsx(isPending && "opacity-50", "custom-button w-full")}
        >
          {isPending ? "Loading..." : "Continue"}
        </button>
        <span className="text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-bold hover:underline">
            Sign up
          </Link>
        </span>
      </div>
    </form>
  );
}
