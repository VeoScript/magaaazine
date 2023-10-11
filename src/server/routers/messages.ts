import { TRPCError } from "@trpc/server";
// import { cookies } from "next/headers";

import prisma from "~/config/Prisma";
import z from "zod";

import { router, publicProcedure } from "../trpc";

export const messagesRouter = router({
  sendMessage: publicProcedure
    .input(
      z.object({
        is_anonymous: z.boolean(),
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
});
