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
        primary: {
          50: "#F5F0E8",
          100: "#EBE1D1",
          200: "#D4C4B0",
          300: "#C3A27C",
          400: "#B89568",
          500: "#C3A27C",
          600: "#A98862",
          700: "#8F7252",
          800: "#755C42",
          900: "#5B4632",
        },
        accent: {
          50: "#F5F0E8",
          100: "#EBE1D1",
          200: "#D4C4B0",
          300: "#C3A27C",
          400: "#B89568",
          500: "#C3A27C",
          600: "#A98862",
          700: "#8F7252",
          800: "#755C42",
          900: "#5B4632",
        },
        dark: {
          50: "#F8F9FA",
          100: "#E9ECEF",
          200: "#DEE2E6",
          300: "#CED4DA",
          400: "#ADB5BD",
          500: "#6C757D",
          600: "#495057",
          700: "#343A40",
          800: "#212529",
          900: "#1A1A1A",
        },
      },
      boxShadow: {
        soft: "0 2px 8px rgba(0, 0, 0, 0.08)",
        medium: "0 4px 16px rgba(0, 0, 0, 0.12)",
        hard: "0 8px 24px rgba(0, 0, 0, 0.15)",
        glow: "0 0 20px rgba(195, 162, 124, 0.3)",
      },
      animation: {
        fadeIn: "fadeIn 0.3s ease-in-out",
        slideDown: "slideDown 0.2s ease-out",
        slideUp: "slideUp 0.2s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideDown: {
          "0%": { opacity: "0", transform: "translateY(-10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
