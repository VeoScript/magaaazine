"use client";

export default function ProfileSkeletonLoader() {
  return (
    <div className="mt-10 flex h-full w-full flex-col items-center justify-center">
      <div className="flex w-full max-w-2xl flex-col items-center gap-y-10 px-5 pb-10">
        <div className="h-[13rem] w-[13rem] animate-pulse rounded-full bg-neutral-300 object-cover dark:bg-slate-700" />
        <div className="flex w-full flex-col items-center gap-y-2">
          <div className="h-[2rem] w-[20rem] animate-pulse rounded-full bg-neutral-300 dark:bg-slate-700" />
          <div className="h-[1.5rem] w-[15rem] animate-pulse rounded-full bg-neutral-300 dark:bg-slate-700" />
        </div>
        <div className="flex w-full flex-row items-center justify-center gap-x-2">
          <div className="h-[2rem] w-[2rem] animate-pulse rounded-full bg-neutral-300 dark:bg-slate-700" />
          <div className="h-[2rem] w-[2rem] animate-pulse rounded-full bg-neutral-300 dark:bg-slate-700" />
          <div className="h-[2rem] w-[2rem] animate-pulse rounded-full bg-neutral-300 dark:bg-slate-700" />
          <div className="h-[2rem] w-[2rem] animate-pulse rounded-full bg-neutral-300 dark:bg-slate-700" />
          <div className="h-[2rem] w-[2rem] animate-pulse rounded-full bg-neutral-300 dark:bg-slate-700" />
        </div>
        <div className="flex w-full flex-col items-center gap-y-3">
          <div className="h-[2rem] w-[20rem] animate-pulse rounded-full bg-neutral-300 dark:bg-slate-700" />
          <div className="h-[1.5rem] w-full animate-pulse rounded-full bg-neutral-300 dark:bg-slate-700" />
        </div>
        <div className="h-[15rem] w-full animate-pulse rounded-xl bg-neutral-300 dark:bg-slate-700" />
      </div>
    </div>
  );
}
