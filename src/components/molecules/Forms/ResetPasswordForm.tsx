"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import clsx from "clsx";

import { trpc } from "~/app/_trpc/client";
import { myToast } from "~/components/atoms/MyToast";
import { resetPasswordValidation } from "~/lib/hooks/useValidation";

interface ResetPasswordProps {
  token: string;
}

export default function ResetPasswordForm({ token }: ResetPasswordProps) {
  const router = useRouter();

  const resetPasswordMutation = trpc.resetPassword.useMutation();

  const [isPending, setIsPending] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const [repassword, setRepassword] = useState<string>("");

  const [resetPasswordFormErrors, setResetPasswordFormErrors] = useState<any>(null);

  const handleResetPassword = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await resetPasswordValidation.validate({ password, repassword }, { abortEarly: false });

      setIsPending(true);

      await resetPasswordMutation.mutateAsync(
        {
          token,
          password,
        },
        {
          onSuccess: (data) => {
            myToast({
              type: "success",
              message: data.message,
            });
            router.push("/");
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
        setResetPasswordFormErrors(errors);
      }
    }
  };

  return (
    <form
      onSubmit={handleResetPassword}
      className="flex w-full max-w-lg flex-col items-start gap-y-3 p-5 md:p-0"
    >
      <h1 className="mb-1 ml-1.5 text-xl font-bold">Reset Password</h1>
      <div className="flex w-full flex-col gap-y-1">
        <label htmlFor="email" className="ml-1.5 text-sm">
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
            setResetPasswordFormErrors(null);
            setPassword(e.currentTarget.value);
          }}
        />
        {resetPasswordFormErrors && resetPasswordFormErrors.password && (
          <span className="ml-2 mt-1 text-xs font-medium text-red-500">
            {resetPasswordFormErrors.password}
          </span>
        )}
      </div>
      <div className="flex w-full flex-col gap-y-1">
        <label htmlFor="repassword" className="ml-1.5 text-sm">
          Re-type password
        </label>
        <input
          disabled={isPending}
          autoComplete="false"
          type="password"
          id="repassword"
          className="custom-input"
          value={repassword}
          onChange={(e) => {
            setResetPasswordFormErrors(null);
            setRepassword(e.currentTarget.value);
          }}
        />
        {resetPasswordFormErrors && resetPasswordFormErrors.repassword && (
          <span className="ml-2 mt-1 text-xs font-medium text-red-500">
            {resetPasswordFormErrors.repassword}
          </span>
        )}
      </div>
      <div className="flex w-full flex-col items-center gap-y-3">
        <button
          disabled={isPending}
          type="submit"
          className={clsx(isPending && "opacity-50", "custom-button w-full")}
        >
          {isPending ? "Loading..." : "Reset"}
        </button>
        <Link href="/" className="text-sm hover:underline">
          Back to Home page
        </Link>
      </div>
    </form>
  );
}
