import withPlaiceholder from "@plaiceholder/next";

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    scrollRestoration: true,
  },
  env: {
    IMGBB_API_KEY: process.env.IMGBB_API_KEY,
  },
  images: {
    dangerouslyAllowSVG: true,
    domains: ['i.ibb.co', 'pbs.twimg.com'],
  },
  env: {
    PROD_URL: process.env.PROD_URL,
    DEV_URL: process.env.DEV_URL,
  },
  async headers() {
    return [
      {
        // matching all API routes
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,OPTIONS,PATCH,DELETE,POST,PUT",
          },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
          },
        ],
      },
    ];
  },
};

export default withPlaiceholder(nextConfig);