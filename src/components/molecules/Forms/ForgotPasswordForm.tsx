"use client";

import { useState, FormEvent } from "react";
import clsx from "clsx";

import { trpc } from "~/app/_trpc/client";
import { myToast } from "~/components/atoms/MyToast";
import { forgotPasswordValidation } from "~/lib/hooks/useValidation";

export default function ForgotPasswordForm() {
  const [isPending, setIsPending] = useState<boolean>(false);
  const [forgotPasswordFormErrors, setForgotPasswordFormErrors] = useState<any>(null);
  const [email, setEmail] = useState<string>("");

  const sendResetInstructionMutation = trpc.sendResetInstruction.useMutation();

  const handleSendEmail = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await forgotPasswordValidation.validate({ email }, { abortEarly: false });

      setIsPending(true);

      await sendResetInstructionMutation.mutateAsync(
        {
          email,
        },
        {
          onSuccess: (data) => {
            setEmail("");
            setIsPending(false);
            myToast({
              type: "success",
              message: data.message,
            });
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
        setForgotPasswordFormErrors(errors);
      }
    }
  };

  return (
    <form
      onSubmit={handleSendEmail}
      className="flex w-full max-w-lg flex-col items-start gap-y-5 p-5 md:p-0"
    >
      <h1 className="mb-1 ml-1.5 text-xl font-bold">Forgot Password?</h1>
      <p className="ml-1 text-sm">
        Enter the email address you used when you joined and we’ll send you instructions to reset
        your password. <br /> <br /> For security reasons, we do NOT store your password. So rest
        assured that we will never send your password via email.
      </p>
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
            setForgotPasswordFormErrors(null);
            setEmail(e.currentTarget.value);
          }}
        />
        {forgotPasswordFormErrors && forgotPasswordFormErrors.email && (
          <span className="ml-2 mt-1 text-xs font-medium text-red-500">
            {forgotPasswordFormErrors.email}
          </span>
        )}
      </div>
      <div className="flex w-full flex-row items-center justify-between gap-x-3">
        <button
          disabled={isPending}
          type="submit"
          className={clsx(isPending && "opacity-50", "custom-button w-full md:w-auto")}
        >
          {isPending ? "Sending..." : "Send Reset Instructions"}
        </button>
      </div>
    </form>
  );
}
