import { TRPCError } from "@trpc/server";
import { cookies } from "next/headers";

import prisma from "~/config/Prisma";
import z from "zod";

import { utapi } from "../uploadthing";
import { router, publicProcedure } from "../trpc";

export const filesImagesRouter = router({
  allFilesImages: publicProcedure.query(async () => {
    if (!cookies().has(`${process.env.COOKIE_NAME}`)) {
      return;
    }
    return await prisma.filesImages.findMany({
      where: {
        receiver_id: cookies().get(`${process.env.COOKIE_NAME}`)?.value,
      },
      select: {
        id: true,
        is_read: true,
        is_anonymous: true,
        name: true,
        type: true,
        url: true,
        delete_url: true,
      },
    });
  }),
  filesImages: publicProcedure
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

      const filesImages = await prisma.filesImages.findMany({
        where: {
          receiver_id: cookies().get(`${process.env.COOKIE_NAME}`)?.value,
          name: {
            contains: search as string,
            mode: "insensitive",
          },
        },
        select: {
          id: true,
          is_read: true,
          is_anonymous: true,
          name: true,
          type: true,
          url: true,
          delete_url: true,
          sender: {
            select: {
              id: true,
              username: true,
              is_verified: true,
            },
          },
          receiver: {
            select: {
              id: true,
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

      if (filesImages.length > limit) {
        const nextItem = filesImages.pop();
        nextCursor = nextItem!.id;
      }

      return {
        filesImages,
        nextCursor,
      };
    }),
  deleteFileImage: publicProcedure
    .input(
      z.object({
        id: z.string(),
        type: z.enum(["IMAGE", "FILE"]),
        delete_url: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      if (!cookies().has(`${process.env.COOKIE_NAME}`)) {
        return;
      }

      if (input.type === "FILE" && input.delete_url) {
        await utapi.deleteFiles(input.delete_url);
      }

      const files = await prisma.filesImages.delete({
        where: {
          id: input.id,
        },
      });

      if (files) {
        return {
          message: "File/image deleted successfully.",
        };
      } else {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Something wrong while deleting a file/image.",
        });
      }
    }),
  deleteAllFilesImages: publicProcedure
    .input(
      z.object({
        allFiles: z.any(),
        files: z.any(),
      }),
    )
    .mutation(async ({ input }) => {
      if (!cookies().has(`${process.env.COOKIE_NAME}`)) {
        return;
      }

      const hasImageFile = input?.allFiles
        ? input?.allFiles.some((file: { type: string }) => file.type === "FILE")
        : false;

      if (hasImageFile) {
        await utapi.deleteFiles(input.files);
      }

      const allFiles = await prisma.filesImages.deleteMany({
        where: {
          receiver: {
            id: cookies().get(`${process.env.COOKIE_NAME}`)?.value,
          },
        },
      });

      if (allFiles) {
        return {
          message: "All files/images deleted successfully.",
        };
      } else {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Something wrong while deleting all files/images.",
        });
      }
    }),
  // autoDeleteAllFilesImages: publicProcedure.mutation(async () => {
  //   // let oneDayAgo = new Date();
  //   // oneDayAgo.setDate(oneDayAgo.getDate() - 1);

  //   const allFiles = await prisma.filesImages.findMany({
  //     where: {
  //       type: "FILE",
  //       // created_at: {
  //       //   lt: oneDayAgo,
  //       // },
  //     },
  //   });

  //   if (allFiles) {
  //     const uploadthingDeleteAllFiles = await utapi.deleteFiles(
  //       allFiles ? allFiles.map((file) => file.delete_url as string) : [],
  //     );

  //     await prisma.filesImages.deleteMany({
  //       where: {
  //         type: "FILE",
  //         // created_at: {
  //         //   lt: oneDayAgo,
  //         // },
  //       },
  //     });

  //     if (uploadthingDeleteAllFiles.success) {
  //       return {
  //         message: "All files/images deleted successfully.",
  //       };
  //     } else {
  //       throw new TRPCError({
  //         code: "BAD_REQUEST",
  //         message: "Something wrong while deleting all files/images.",
  //       });
  //     }
  //   }
  // }),
});
