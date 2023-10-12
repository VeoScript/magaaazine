import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["var(--font-poppins)", ...fontFamily.sans],
        raleway: ["var(--font-raleway)", ...fontFamily.sans],
        "abril-fatface": ["var(--font-abril-fatface)", ...fontFamily.sans],
      },
    },
  },
  plugins: [],
};
export default config;
