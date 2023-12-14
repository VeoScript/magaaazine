import { TRPCError } from "@trpc/server";
import { cookies } from "next/headers";

import prisma from "~/config/Prisma";
import * as bcrypt from "bcrypt";
import z from "zod";

import { router, publicProcedure } from "../trpc";

const roundsOfHashing = 10;

export const authRouter = router({
  user: publicProcedure.query(async () => {
    if (!cookies().has(`${process.env.COOKIE_NAME}`)) {
      return;
    }

    return await prisma.user.findUnique({
      where: {
        id: cookies().get(`${process.env.COOKIE_NAME}`)?.value,
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
  signup: publicProcedure
    .input(
      z.object({
        name: z.string(),
        email: z.string(),
        password: z.string(),
        repassword: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      if (input.password !== input.repassword) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Password not matched.",
        });
      }

      const foundUser = await prisma.user.findUnique({
        where: {
          email: input.email,
        },
      });

      if (foundUser) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "This email is not available.",
        });
      }

      const hashedPassword = await bcrypt.hash(input.password, roundsOfHashing);

      const charset = "abcdefghijklmnopqrstuvwxyz0123456789";

      let username = "";

      for (let i = 0; i < 5; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        username += charset.charAt(randomIndex);
      }

      const user = await prisma.user.create({
        data: {
          name: input.name,
          email: input.email,
          username,
          password: hashedPassword,
        },
        select: {
          id: true,
          name: true,
          username: true,
        },
      });

      cookies().set({
        name: "magaaazine",
        value: user.id,
        httpOnly: true,
        path: "/",
        maxAge: 30 * 24 * 60 * 60,
        expires: 24 * 60 * 60,
      });

      return user;
    }),
  signin: publicProcedure
    .input(
      z.object({
        email: z.string(),
        password: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const user = await prisma.user.findUnique({
        where: {
          email: input.email,
        },
        select: {
          id: true,
          email: true,
          username: true,
          password: true,
        },
      });

      if (!user) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Account not found.",
        });
      }

      const matchedPassword = await bcrypt.compare(input.password, user.password);

      if (!matchedPassword) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Incorrect password.",
        });
      }

      cookies().set({
        name: "magaaazine",
        value: user.id,
        httpOnly: true,
        path: "/",
        maxAge: 30 * 24 * 60 * 60,
        expires: 24 * 60 * 60,
      });

      return {
        id: user.id,
        email: user.email,
        username: user.username,
      };
    }),
  signout: publicProcedure.mutation(async () => {
    cookies().delete("magaaazine");
  }),
});
