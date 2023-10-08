import { TRPCError } from "@trpc/server";
import { cookies } from "next/headers";

import prisma from "~/config/Prisma";

import { router, publicProcedure } from "../trpc";

export const userRouter = router({
  users: publicProcedure.query(async () => {
    if (!cookies().has(`${process.env.COOKIE_NAME}`)) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "UNAUTHENTICATED",
      });
    }
    return await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
      },
    });
  }),
});
