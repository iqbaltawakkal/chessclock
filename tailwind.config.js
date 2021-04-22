const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  mode: "jit",
  purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
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
