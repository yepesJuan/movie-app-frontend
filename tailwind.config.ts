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
        primary: "#093545",
        buttonPrimary: "#2AD17E",
        inputBg: "#224957",
        error: "#eb5758",
      },
    },
  },
  plugins: [],
};

export default config;
