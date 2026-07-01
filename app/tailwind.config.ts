import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          night: "#08111F",
          blue: "#4F8CFF",
          cyan: "#5EEAD4",
          sand: "#FFF7ED"
        }
      }
    }
  },
  plugins: []
};

export default config;
