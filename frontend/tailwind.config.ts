import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        beige: {
          lightest: "#E4DDCD",
          light: "#D4C4B0",
          DEFAULT: "#C3A27C",
          dark: "#A98862",
        },
      },
    },
  },
  plugins: [],
};
export default config;
