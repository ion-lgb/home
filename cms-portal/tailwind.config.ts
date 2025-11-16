import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["'SF Pro Display'", "Inter", "Space Grotesk", "system-ui", "sans-serif"],
      },
      colors: {
        brand: {
          50: "#f5f5f7",
          500: "#0f172a",
          600: "#020617"
        }
      }
    }
  },
  plugins: [require("@tailwindcss/typography")]
};

export default config;
