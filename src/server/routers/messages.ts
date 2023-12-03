import { TRPCError } from "@trpc/server";
import { cookies } from "next/headers";

import prisma from "~/config/Prisma";
import z from "zod";

import { router, publicProcedure } from "../trpc";

export const messagesRouter = router({
  messages: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.string().nullish(),
        search: z.string().nullish(),
      }),
    )
    .query(async (opts) => {
      if (!cookies().has(`${process.env.COOKIE_NAME}`)) {
        return;
      }

      const { input } = opts;
      const limit = input.limit ?? 30;
      const { search, cursor } = input;

      const messages = await prisma.message.findMany({
        where: {
          receiver_id: cookies().get(`${process.env.COOKIE_NAME}`)?.value,
          content: {
            contains: search as string,
            mode: "insensitive",
          },
        },
        select: {
          id: true,
          is_read: true,
          is_anonymous: true,
          has_file: true,
          content: true,
          sender: {
            select: {
              id: true,
              profile_photo: true,
              username: true,
              is_verified: true,
            },
          },
          receiver: {
            select: {
              id: true,
              profile_photo: true,
              username: true,
              is_verified: true,
            },
          },
          created_at: true,
        },
        orderBy: {
          created_at: "desc",
        },
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
      });

      let nextCursor: typeof cursor | undefined = undefined;

      if (messages.length > limit) {
        const nextItem = messages.pop();
        nextCursor = nextItem!.id;
      }

      return {
        messages,
        nextCursor,
      };
    }),
  sendMessage: publicProcedure
    .input(
      z.object({
        is_anonymous: z.boolean(),
        has_file: z.boolean(),
        content: z.string(),
        sender_id: z.string(),
        receiver_id: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const message = await prisma.message.create({
        data: {
          is_anonymous: input.is_anonymous,
          content: input.content,
          has_file: input.has_file,
          sender_id: input.is_anonymous ? null : input.sender_id,
          receiver_id: input.receiver_id,
        },
      });

      if (message) {
        return {
          message: "Message created successfully.",
        };
      } else {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Something wrong while sending a message.",
        });
      }
    }),
  deleteMessage: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const message = await prisma.message.delete({
        where: {
          id: input.id,
        },
      });

      if (message) {
        return {
          message: "Message deleted successfully.",
        };
      } else {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Something wrong while deleting a message.",
        });
      }
    }),
  deleteAllMessage: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const message = await prisma.message.deleteMany({
        where: {
          receiver: {
            id: input.id,
          },
        },
      });

      if (message) {
        return {
          message: "All messages are deleted successfully.",
        };
      } else {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Something wrong while deleting all messages.",
        });
      }
    }),
});
