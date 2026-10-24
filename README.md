<p align="center">
  <img src=".github/magaaazine.png" width="100" height="100">
  <h1 align="center">Magaaazine</h1>
  <p align="center">EMPOWER YOUR ONLINE PRESENCE WITH MAGAAAZINE.</p>
</p>

<p align="center">
  <a href="https://github.com/veoscript/magaaazine/blob/master/LICENSE">
    <img alt="GitHub" src="https://img.shields.io/github/license/veoscript/magaaazine.svg?color=green">
  </a>
  <a href="https://github.com/veoscript/magaaazine/releases">
    <img alt="GitHub release" src="https://img.shields.io/github/release/veoscript/magaaazine.svg">
  </a>
  <a href="CODE_OF_CONDUCT.md">
    <img alt="Contributor Covenant" src="https://img.shields.io/badge/Contributor%20Covenant-2.0-4baaaa.svg">
  </a>
</p>

## Description

Discover, connect, and share with Magaaazine. Create a profile to receive anonymous messages, images, and files, discover other profiles, and manage your inbox and profile settings.

## Getting Started

### Requirements

* [Node.js](https://nodejs.org/) v24.11.0 (see `.nvmrc`)
* [PostgreSQL](https://www.postgresql.org/)
* npm

### Tech Stack

* [Next.js 16](https://nextjs.org/) with the App Router and [React 19](https://react.dev/)
* [tRPC 11](https://trpc.io/) and [TanStack Query 5](https://tanstack.com/query/latest)
* [Prisma 7](https://www.prisma.io/) with the PostgreSQL adapter
* [Tailwind CSS 4](https://tailwindcss.com/)
* [UploadThing](https://uploadthing.com/) for file uploads
* [Resend](https://resend.com/) for password reset emails

### Installation

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env` and configure the variables:

   | Variable | Purpose |
   | --- | --- |
   | `PROD_URL` | Public URL of the production app |
   | `DEV_URL` | Local development URL, usually `http://localhost:3000` |
   | `COOKIE_NAME` | Name used for the authentication cookie |
   | `IMGBB_API_KEY` | API key for ImgBB image uploads |
   | `IMGUR_API_KEY` | API key for Imgur image uploads |
   | `UPLOADTHING_TOKEN` | UploadThing token for file uploads |
   | `RESEND_API_KEY` | Resend API key for password reset emails |
   | `JWT_SECRET` | Secret used to sign password reset tokens |
   | `DATABASE_URL` | PostgreSQL connection URL |

3. Create the database, then apply the Prisma migrations:

   ```bash
   npx prisma migrate dev
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

The app will be available at `http://localhost:3000`.

### Available Scripts

* `npm run dev` — start the development server
* `npm run build` — generate the Prisma client and build the app
* `npm run start` — start the production server
* `npm run lint` — lint the `src` directory

## Authors

Jerome Villaruel — [@VeoScript](https://www.jeromevillaruel.cf/)

> Production Ready
