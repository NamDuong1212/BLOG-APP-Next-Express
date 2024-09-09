import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      sm: "480px",
      md: "768px",
      lg: "1024px",

    },
    extend: {
      colors: {
        primaryColor: "#f7aa1d",
        primaryColorLight: "#1e3133",
        secondaryColor: "#121d1e",
        paragraphColor: "#888",
        whiteColor: "#d3d3d3",
      },
    },
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "1.5rem",
      },
      screens: {
        sm: "100%",
        md: "100%",
        lg: "1024px",
        xl: "1280px",     // Điều chỉnh độ rộng container cho màn hình lớn
        "2xl": "1400px",  // Độ rộng lớn hơn cho màn hình cực lớn
      },
    },
  },
  plugins: [],
};
export default config;
