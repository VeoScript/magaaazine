import { TRPCError } from "@trpc/server";
import { encode, decode } from "jwt-simple";

import * as React from "react";
import moment from "moment";
import prisma from "~/config/Prisma";
import z from "zod";
import * as bcrypt from "bcrypt";

import { EmailTemplate } from "~/components/molecules/EmailTemplate";
import { Resend } from "resend";

import { router, publicProcedure } from "../trpc";

const resend = new Resend(process.env.RESEND_API_KEY);

const roundsOfHashing = 10;

export const resetPasswordRouter = router({
  sendResetInstruction: publicProcedure
    .input(
      z.object({
        email: z.string(),
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
          name: true,
        },
      });

      if (user) {
        let expires = moment().add(5, "minutes").unix();

        const payload = { exp: expires, userId: user.id };
        const secret = process.env.JWT_SECRET as string;
        const token = encode(payload, secret);

        const emailData = await resend.emails.send({
          from: "Magaaazine <magaaazine_social@magaaazine.online>",
          to: input.email,
          subject: "Reset Password",
          react: EmailTemplate({ name: user.name, token }) as React.ReactElement,
        });

        if (emailData) {
          return {
            message: "Email sent successfully. Check your email.",
          };
        } else {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "There is an error while sending an email.",
          });
        }
      } else {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Email not found, try again.",
        });
      }
    }),
  resetPassword: publicProcedure
    .input(
      z.object({
        token: z.string(),
        password: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const secret = process.env.JWT_SECRET as string;
      const tokenData = decode(input.token, secret);

      const userId = tokenData.userId;
      const expirationTime = tokenData.exp;

      if (moment().unix() >= expirationTime) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "The reset-password link is expired.",
        });
      }

      const hashedPassword = await bcrypt.hash(input.password, roundsOfHashing);

      const reset_password = await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          password: hashedPassword,
        },
      });

      if (reset_password) {
        return {
          message: "Password reset successfully.",
        };
      } else {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Error while resetting your password, try again.",
        });
      }
    }),
});
