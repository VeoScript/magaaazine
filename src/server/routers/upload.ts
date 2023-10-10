import { TRPCError } from "@trpc/server";
import { cookies } from "next/headers";

import prisma from "~/config/Prisma";
import z from "zod";

import { router, publicProcedure } from "../trpc";

export const uploadRouter = router({
  uploadProfile: publicProcedure.input(z.object({ profileUrl: z.any() })).mutation(async ({ input }) => {
    if (!cookies().has(`${process.env.COOKIE_NAME}`)) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "YOU ARE UNAUTHENTICATED",
      });
    }
    return await prisma.user.update({
      where: {
        id: cookies().get(`${process.env.COOKIE_NAME}`)?.value,
      },
      data: {
        profile_photo: input.profileUrl,
      },
      select: {
        id: true,
        name: true,
        username: true,
      }
    });
  }),
  uploadCover: publicProcedure.input(z.object({ coverUrl: z.any() })).mutation(async ({ input }) => {
    if (!cookies().has(`${process.env.COOKIE_NAME}`)) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "YOU ARE UNAUTHENTICATED",
      });
    }
    return await prisma.user.update({
      where: {
        id: cookies().get(`${process.env.COOKIE_NAME}`)?.value,
      },
      data: {
        cover_photo: input.coverUrl,
      },
      select: {
        id: true,
        name: true,
        username: true,
      }
    });
  }),
});
