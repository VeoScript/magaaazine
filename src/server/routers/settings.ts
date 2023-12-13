import { TRPCError } from "@trpc/server";
import { Prisma } from "@prisma/client";
import { cookies } from "next/headers";

import prisma from "~/config/Prisma";
import * as bcrypt from "bcrypt";
import z from "zod";

import { router, publicProcedure } from "../trpc";

const roundsOfHashing = 10;

export const settingsRouter = router({
  updatePrivacy: publicProcedure
    .input(
      z.object({
        is_display_name: z.boolean(),
        is_receive_files_anonymous: z.boolean(),
        is_receive_images_anonymous: z.boolean(),
      }),
    )
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
          is_display_name: input.is_display_name,
          is_receive_files_anonymous: input.is_receive_files_anonymous,
          is_receive_images_anonymous: input.is_receive_images_anonymous,
        },
        select: {
          id: true,
          name: true,
          username: true,
        },
      });
    }),
  updateBasicInfo: publicProcedure
    .input(
      z.object({
        name: z.string(),
        username: z.string(),
        short_bio: z.string(),
        favorite_quote: z.string(),
        email: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        if (!cookies().has(`${process.env.COOKIE_NAME}`)) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "YOU ARE UNAUTHENTICATED",
          });
        }
        const user = await prisma.user.update({
          where: {
            id: cookies().get(`${process.env.COOKIE_NAME}`)?.value,
          },
          data: {
            name: input.name,
            username: input.username,
            email: input.email,
            short_bio: input.short_bio,
            favorite_quote: input.favorite_quote,
          },
          select: {
            id: true,
            name: true,
            username: true,
          },
        });

        if (user) {
          return {
            user,
          };
        } else {
          return {
            message: "Something wrong while updating the basic information.",
          };
        }
      } catch (error: any) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === "P2002") {
            const errorMeta: any = error?.meta;
            throw new TRPCError({
              code: "CONFLICT",
              message: errorMeta?.target[0],
            });
          }
        }
        throw error;
      }
    }),
  updateSocial: publicProcedure
    .input(
      z.object({
        facebook: z.string(),
        instagram: z.string(),
        twitterx: z.string(),
        tiktok: z.string(),
        linkedin: z.string(),
        github: z.string(),
        youtube: z.string(),
        spotify: z.string(),
        website: z.string(),
      }),
    )
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
          facebook_link: input.facebook,
          instagram_link: input.instagram,
          twitterx_link: input.twitterx,
          tiktok_link: input.tiktok,
          linkedin_link: input.linkedin,
          github_link: input.github,
          youtube_link: input.youtube,
          spotify_link: input.spotify,
          website_link: input.website,
        },
        select: {
          id: true,
          name: true,
          username: true,
        },
      });
    }),
  updatePassword: publicProcedure
    .input(
      z.object({
        old_password: z.string(),
        new_password: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      if (!cookies().has(`${process.env.COOKIE_NAME}`)) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "YOU ARE UNAUTHENTICATED",
        });
      }

      const currentUser = await prisma.user.findUnique({
        where: {
          id: cookies().get(`${process.env.COOKIE_NAME}`)?.value,
        },
        select: {
          password: true,
        },
      });

      if (currentUser) {
        const matchedPassword = await bcrypt.compare(input.old_password, currentUser.password);

        if (!matchedPassword) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Old password is invalid.",
          });
        }

        const hashedPassword = await bcrypt.hash(input.new_password, roundsOfHashing);

        return await prisma.user.update({
          where: {
            id: cookies().get(`${process.env.COOKIE_NAME}`)?.value,
          },
          data: {
            password: hashedPassword,
          },
          select: {
            id: true,
            name: true,
            username: true,
          },
        });
      }
    }),
});
