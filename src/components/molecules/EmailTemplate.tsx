/* eslint-disable @next/next/no-img-element */
import * as React from "react";
import { Heading, Tailwind, Row, Column, Text, Link } from "@react-email/components";

interface EmailTemplateProps {
  name: string;
  token: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  name,
  token,
}): JSX.Element => (
  <Tailwind>
    <Row className="flex w-full flex-col items-center gap-y-5">
      <Column className="flex w-full flex-col items-center">
        <Heading as="h1" className="text-2xl font-bold">
          Password Reset
        </Heading>
      </Column>
      <Column className="flex w-full flex-col items-center">
        <Text className="text-base">
          {name} thank you for using Magaaazine. If you&apos;ve lost your password or wish to reset
          it, use the link below to get started. This reset-password link will expire after 5
          minutes.
        </Text>
      </Column>
      <Column className="flex w-full flex-col items-center">
        <Link
          className="rounded-lg bg-black px-5 py-3 text-white"
          href={
            process.env.NODE_ENV === "production"
              ? `https://magaaazine.online/reset-password/${token}`
              : `http://localhost:3000/reset-password/${token}`
          }
        >
          Reset Your Password
        </Link>
      </Column>
      <Column className="flex w-full flex-col items-center">
        <Text className="text-base">
          If you did not request a password reset, you can safely ignore this email. Only a person
          with access to your email can reset your account password.
        </Text>
      </Column>
    </Row>
  </Tailwind>
);
