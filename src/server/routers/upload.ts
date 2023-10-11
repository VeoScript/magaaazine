import { TRPCError } from "@trpc/server";
import { cookies } from "next/headers";

import prisma from "~/config/Prisma";
import z from "zod";

import { router, publicProcedure } from "../trpc";

export const uploadRouter = router({
  uploadProfile: publicProcedure
    .input(z.object({ profileUrl: z.any() }))
    .mutation(async ({ input }) => {
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
        },
      });
    }),
  uploadCover: publicProcedure
    .input(z.object({ coverUrl: z.any() }))
    .mutation(async ({ input }) => {
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
        },
      });
    }),
  uploadFilesImages: publicProcedure
    .input(
      z.object({
        is_anonymous: z.boolean(),
        type: z.enum(["IMAGE", "FILE"]),
        name: z.string(),
        url: z.string(),
        delete_url: z.string(),
        sender_id: z.string(),
        receiver_id: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const upload = await prisma.filesImages.create({
        data: {
          is_anonymous: input.is_anonymous,
          type: input.type,
          name: input.name,
          url: input.url,
          delete_url: input.delete_url,
          sender_id: input.is_anonymous ? null : input.sender_id,
          receiver_id: input.receiver_id,
        },
      });

      if (upload) {
        return {
          message: "Files and images are uploaded successfully.",
        };
      } else {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Something wrong while uploading a files/images.",
        });
      }
    }),
});
