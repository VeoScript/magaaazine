"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import clsx from "clsx";

import { trpc } from "~/app/_trpc/client";
import { myToast } from "~/components/atoms/MyToast";
import { signupValidation } from "~/lib/hooks/useValidation";

export default function SignUpForm() {
  const router = useRouter();

  const utils = trpc.useContext();
  const signUpMutation = trpc.signup.useMutation();

  const [isPending, setIsPending] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [repassword, setRepassword] = useState<string>("");

  const [signUpFormErrors, setSignUpFormErrors] = useState<any>(null);

  const handleSignUp = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await signupValidation.validate({ name, email, password, repassword }, { abortEarly: false });

      setIsPending(true);

      await signUpMutation.mutateAsync(
        {
          name,
          email,
          password,
          repassword,
        },
        {
          onSuccess: (data) => {
            utils.users.invalidate();
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
        setSignUpFormErrors(errors);
      }
    }
  };

  return (
    <form
      onSubmit={handleSignUp}
      className="flex w-full max-w-lg flex-col items-start gap-y-3 p-5 md:p-0"
    >
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
          onChange={(e) => {
            const value = e.currentTarget.value;
            const capitalizedValue = value
              .split(" ")
              .map((word) => (word ? word.charAt(0).toUpperCase() + word.slice(1) : ""))
              .join(" ");
            setSignUpFormErrors(null);
            setName(capitalizedValue);
          }}
        />
        {signUpFormErrors && signUpFormErrors.name && (
          <span className="ml-2 mt-1 text-xs font-medium text-red-500">
            {signUpFormErrors.name}
          </span>
        )}
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
          onChange={(e) => {
            setSignUpFormErrors(null);
            setEmail(e.currentTarget.value);
          }}
        />
        {signUpFormErrors && signUpFormErrors.email && (
          <span className="ml-2 mt-1 text-xs font-medium text-red-500">
            {signUpFormErrors.email}
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
          className={clsx(isPending && "cursor-not-allowed", "custom-input")}
          value={password}
          onChange={(e) => {
            setSignUpFormErrors(null);
            setPassword(e.currentTarget.value);
          }}
        />
        {signUpFormErrors && signUpFormErrors.password && (
          <span className="ml-2 mt-1 text-xs font-medium text-red-500">
            {signUpFormErrors.password}
          </span>
        )}
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
          onChange={(e) => {
            setSignUpFormErrors(null);
            setRepassword(e.currentTarget.value);
          }}
        />
        {signUpFormErrors && signUpFormErrors.repassword && (
          <span className="ml-2 mt-1 text-xs font-medium text-red-500">
            {signUpFormErrors.repassword}
          </span>
        )}
      </div>
      <div className="flex w-full flex-col-reverse items-center justify-start gap-x-0 gap-y-3 md:flex-row md:justify-between md:gap-x-3 md:gap-y-0">
        <span className="text-sm">
          Already have an account?{" "}
          <Link href="/signin" className="font-bold hover:underline">
            Sign in
          </Link>
        </span>
        <button
          disabled={isPending}
          type="submit"
          className={clsx(isPending && "opacity-50", "custom-button w-full md:w-auto")}
        >
          {isPending ? "Loading..." : "Continue"}
        </button>
      </div>
    </form>
  );
}
