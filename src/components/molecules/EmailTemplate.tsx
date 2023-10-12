import * as React from "react";
import { Heading, Tailwind, Row, Column, Img, Text, Link } from "@react-email/components";

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
        <Img
          className="h-[10rem] w-[10rem]"
          src="https://lh3.googleusercontent.com/pw/ADCreHfiBPBSesZn9SRYNJoexwOjERhT2uMNZIr4nRAayv7PzU1QVbUeJWuaOVRF0KBrEazdLbs5P5rr73KkamS6-S-Pa-VE4die8fXUtVwJSePMNMusyKZ4xmHtGaX0drsg5-bWdhfFNzvSDxD_HBgIyG6sPy9yLKwb-L8KnwioSQg8i-E9n0liuYEj_AmAw7R8qIrX_DnWBKJ-hUC25dyXO65UaYbaOerE_cs6wDBQtad5TzLJ_I_0blFLW3nUHlViZBLRN3lQPdCUcOOchq1r5q0iNvsAhDoTm31M-L0zCjbo6w2FzpPZSwISbT8jvJhjDzv4GBN3rPqRTKmy0wxGJUrDPrVMehTtAXgNQE8nM0op9xy_qf3TdMVu_0xpzUykJNAuXHtAZMnjEsF4VV7t2mQz644larMUmxEid8y_saEtGfJvm8qwEa9EqpiLequ3aDfQwL2faZWavQwh7VGUEAL4l0nRVYX30oeXSwnpnnnfcm04wg59fGthWKWtubK8nPZ_I2dWISpmeOLwIvQv5NuqAjFUicvwpY94qyUiK1mkSxHTNDgl7lhx7B-jnCUebrvEs8MPLJYM1flQOn_dk1I98lBGAh2x9TwwDerNQzXm6Y9NVKL3TdYdInIU26JIrZhq5pO8KOk2ynggZ6HKqSN32ccPuCrD7tkImatoq5iPNTr7sU0dLS_Dm3QOesbo15zlRelGuAM6yGZkKtAOio4goru0-uyUe_G_rdQdngahQckw5q4Z7X4KIZ1xMbh7hSdTJ1ea63F2FG7URQR2HBrMkAcCKa_RD4CnZ8_uMsjuhPC9Ih5e88epcGY_RnXURFWWtHKUiSWWbxp3qEaFoxiPINgtBz-OZpTn3i2PvavSAqKfeFWqM4FCNx5BVslgoQlD8vSkDARCDLQG6-zYDr2yMwp0sQw9OnFda964ZxJFQ5DxAJcnUPa4546yNukMuRbFvmk_8heEEsbHm5DWSykQn9GFi893taj55tVvoUQ1h7QmtAD0xCuGuYpMzY0V500=w938-h938-s-no?authuser=0"
          alt="magaaazine_logo"
          width="300"
          height="300"
        />
      </Column>
      <Column className="flex w-full flex-col items-center">
        <Heading as="h1" className="text-2xl font-bold">
          Password Reset
        </Heading>
      </Column>
      <Column className="flex w-full flex-col items-center">
        <Text className="text-base">
          {name} if you&apos;ve lost your password or wish to reset it, use the link below to get
          started. This reset-password link will expire after 5 minutes.
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
        ;
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
