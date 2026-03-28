import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      boxShadow: {
        "card": "0 20px 60px rgba(0,0,0,0.25)"
      },
      colors: {
        "ink-black": "#07070A",
        "gold": {
          DEFAULT: "#D4AF37",
          200: "#F2D27A",
          500: "#C49A2A"
        },
        "paper": "#F8F8FB"
      }
    }
  },
  plugins: []
};

export default config;

