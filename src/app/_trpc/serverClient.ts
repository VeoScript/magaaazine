import { httpBatchLink } from "@trpc/client";

import { appRouter } from "~/server";

export const serverClient = appRouter.createCaller({
  links: [
    httpBatchLink({
      url:
        process.env.NODE_ENV === "development"
          ? `${process.env.DEV_URL}/api/trpc`
          : `${process.env.PROD_URL}/api/trpc`,
    }),
  ],
});
