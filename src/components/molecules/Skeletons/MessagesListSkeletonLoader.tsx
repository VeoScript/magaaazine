"use client";

export default function MessagesListSkeletonLoader() {
  return (
    <div className="mt-5 flex w-full flex-col items-center gap-y-10">
      <div className="relative flex h-[11rem] w-full animate-pulse flex-col items-center gap-x-3 rounded-xl bg-neutral-300 p-3 dark:bg-slate-700">
        <div className="absolute -top-5 h-[5rem] w-[5rem] animate-pulse rounded-xl bg-neutral-400 dark:bg-slate-800" />
        <div className="mt-[4rem] flex w-full flex-col items-center gap-y-2">
          <div className="h-[3rem] w-full animate-pulse rounded-xl bg-neutral-400 p-3 dark:bg-slate-800" />
          <div className="h-[1rem] w-1/2 animate-pulse rounded-xl bg-neutral-400 p-3 dark:bg-slate-800" />
        </div>
      </div>
      <div className="relative flex h-[11rem] w-full animate-pulse flex-col items-center gap-x-3 rounded-xl bg-neutral-300 p-3 dark:bg-slate-700">
        <div className="absolute -top-5 h-[5rem] w-[5rem] animate-pulse rounded-xl bg-neutral-400 dark:bg-slate-800" />
        <div className="mt-[4rem] flex w-full flex-col items-center gap-y-2">
          <div className="h-[3rem] w-full animate-pulse rounded-xl bg-neutral-400 p-3 dark:bg-slate-800" />
          <div className="h-[1rem] w-1/2 animate-pulse rounded-xl bg-neutral-400 p-3 dark:bg-slate-800" />
        </div>
      </div>
      <div className="relative flex h-[11rem] w-full animate-pulse flex-col items-center gap-x-3 rounded-xl bg-neutral-300 p-3 dark:bg-slate-700">
        <div className="absolute -top-5 h-[5rem] w-[5rem] animate-pulse rounded-xl bg-neutral-400 dark:bg-slate-800" />
        <div className="mt-[4rem] flex w-full flex-col items-center gap-y-2">
          <div className="h-[3rem] w-full animate-pulse rounded-xl bg-neutral-400 p-3 dark:bg-slate-800" />
          <div className="h-[1rem] w-1/2 animate-pulse rounded-xl bg-neutral-400 p-3 dark:bg-slate-800" />
        </div>
      </div>
    </div>
  );
}
