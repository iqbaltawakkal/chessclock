const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
 
    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class", // or 'media' or 'class'
  theme: {
    extend: {
      fontWeight: ["hover", "focus"],
      fontFamily: {
        sans: ["-apple-system", ...defaultTheme.fontFamily.sans],
        digital: ["Digital"],
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
