import { cookies } from "next/headers";

import prisma from "~/config/Prisma";
import z from "zod";

import { router, publicProcedure } from "../trpc";

export const unreadRouter = router({
  countMessages: publicProcedure.query(async () => {
    if (!cookies().has(`${process.env.COOKIE_NAME}`)) {
      return 0;
    }
    return await prisma.message.count({
      where: {
        receiver_id: cookies().get(`${process.env.COOKIE_NAME}`)?.value,
        is_read: false,
      },
    });
  }),
  countFilesImages: publicProcedure.query(async () => {
    if (!cookies().has(`${process.env.COOKIE_NAME}`)) {
      return 0;
    }
    return await prisma.filesImages.count({
      where: {
        receiver_id: cookies().get(`${process.env.COOKIE_NAME}`)?.value,
        is_read: false,
      },
    });
  }),
  readMessage: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      if (!cookies().has(`${process.env.COOKIE_NAME}`)) {
        return;
      }
      return await prisma.message.update({
        where: {
          id: input.id,
        },
        data: {
          is_read: true,
        },
      });
    }),
  readAllMessages: publicProcedure.mutation(async () => {
    if (!cookies().has(`${process.env.COOKIE_NAME}`)) {
      return;
    }
    return await prisma.message.updateMany({
      where: {
        receiver_id: cookies().get(`${process.env.COOKIE_NAME}`)?.value,
      },
      data: {
        is_read: true,
      },
    });
  }),
  readFileImage: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      if (!cookies().has(`${process.env.COOKIE_NAME}`)) {
        return;
      }
      return await prisma.filesImages.update({
        where: {
          id: input.id,
        },
        data: {
          is_read: true,
        },
      });
    }),
  readAllFilesImages: publicProcedure.mutation(async () => {
    if (!cookies().has(`${process.env.COOKIE_NAME}`)) {
      return;
    }
    return await prisma.filesImages.updateMany({
      where: {
        receiver_id: cookies().get(`${process.env.COOKIE_NAME}`)?.value,
      },
      data: {
        is_read: true,
      },
    });
  }),
});
