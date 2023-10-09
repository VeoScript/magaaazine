import { TRPCError } from "@trpc/server";
import { cookies } from "next/headers";

import prisma from "~/config/Prisma";
import z from "zod";

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
  profile: publicProcedure.input(z.object({ username: z.string() })).query(async ({ input }) => {
    return await prisma.user.findUnique({
      where: {
        username: input.username,
      },
      select: {
        id: true,
        profile_photo: true,
        cover_photo: true,
        name: true,
        username: true,
        email: true,
        short_bio: true,
        favorite_quote: true,
        facebook_link: true,
        instagram_link: true,
        twitterx_link: true,
        linkedin_link: true,
        github_link: true,
        website_link: true,
        is_display_name: true,
        is_receive_files_anonymous: true,
        is_receive_images_anonymous: true,
        created_at: true,
      },
    });
  }),
});
