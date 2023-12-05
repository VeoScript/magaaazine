"use client";

export default function FilesImagesListSkeletonLoader() {
  return (
    <div className="flex w-full flex-col items-center gap-y-1">
      <div className="flex h-[6rem] w-full animate-pulse flex-row items-center gap-x-3 rounded-xl bg-neutral-300 p-3 dark:bg-slate-700">
        <div className="h-[5rem] w-[5rem] animate-pulse rounded-xl bg-neutral-400 dark:bg-slate-800" />
        <div className="flex w-full flex-1 flex-col items-start gap-y-2">
          <div className="h-[2rem] w-full animate-pulse rounded-full bg-neutral-400 p-3 dark:bg-slate-800" />
          <div className="h-[1rem] w-1/2 animate-pulse rounded-full bg-neutral-400 p-3 dark:bg-slate-800" />
        </div>
      </div>
      <div className="flex h-[6rem] w-full animate-pulse flex-row items-center gap-x-3 rounded-xl bg-neutral-300 p-3 dark:bg-slate-700">
        <div className="h-[5rem] w-[5rem] animate-pulse rounded-xl bg-neutral-400 dark:bg-slate-800" />
        <div className="flex w-full flex-1 flex-col items-start gap-y-2">
          <div className="h-[2rem] w-full animate-pulse rounded-full bg-neutral-400 p-3 dark:bg-slate-800" />
          <div className="h-[1rem] w-1/2 animate-pulse rounded-full bg-neutral-400 p-3 dark:bg-slate-800" />
        </div>
      </div>
      <div className="flex h-[6rem] w-full animate-pulse flex-row items-center gap-x-3 rounded-xl bg-neutral-300 p-3 dark:bg-slate-700">
        <div className="h-[5rem] w-[5rem] animate-pulse rounded-xl bg-neutral-400 dark:bg-slate-800" />
        <div className="flex w-full flex-1 flex-col items-start gap-y-2">
          <div className="h-[2rem] w-full animate-pulse rounded-full bg-neutral-400 p-3 dark:bg-slate-800" />
          <div className="h-[1rem] w-1/2 animate-pulse rounded-full bg-neutral-400 p-3 dark:bg-slate-800" />
        </div>
      </div>
      <div className="flex h-[6rem] w-full animate-pulse flex-row items-center gap-x-3 rounded-xl bg-neutral-300 p-3 dark:bg-slate-700">
        <div className="h-[5rem] w-[5rem] animate-pulse rounded-xl bg-neutral-400 dark:bg-slate-800" />
        <div className="flex w-full flex-1 flex-col items-start gap-y-2">
          <div className="h-[2rem] w-full animate-pulse rounded-full bg-neutral-400 p-3 dark:bg-slate-800" />
          <div className="h-[1rem] w-1/2 animate-pulse rounded-full bg-neutral-400 p-3 dark:bg-slate-800" />
        </div>
      </div>
    </div>
  );
}
