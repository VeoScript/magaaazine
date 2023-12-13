import prisma from "~/config/Prisma";
import z from "zod";

import { router, publicProcedure } from "../trpc";

export const userRouter = router({
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
        tiktok_link: true,
        linkedin_link: true,
        github_link: true,
        youtube_link: true,
        spotify_link: true,
        website_link: true,
        is_verified: true,
        is_display_name: true,
        is_receive_files_anonymous: true,
        is_receive_images_anonymous: true,
        created_at: true,
      },
    });
  }),
  users: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.string().nullish(),
        search: z.string().nullish(),
      }),
    )
    .query(async (opts) => {
      const { input } = opts;
      const limit = input.limit ?? 10;
      const { search, cursor } = input;

      const users = await prisma.user.findMany({
        where: {
          OR: [
            {
              name: {
                contains: search as string,
                mode: "insensitive",
              },
            },
            {
              username: {
                contains: search as string,
                mode: "insensitive",
              },
            },
          ],
        },
        select: {
          id: true,
          cover_photo: true,
          profile_photo: true,
          name: true,
          email: true,
          username: true,
          is_verified: true,
        },
        orderBy: {
          created_at: "desc",
        },
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
      });

      let nextCursor: typeof cursor | undefined = undefined;

      if (users.length > limit) {
        const nextItem = users.pop();
        nextCursor = nextItem!.id;
      }

      return {
        users,
        nextCursor,
      };
    }),
});
