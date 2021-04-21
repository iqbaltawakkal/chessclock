const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  mode: "jit",
  darkMode: "class",
  purge: {
    enabled: process.env.NODE_ENV === "production",
    safeList: [],
    content: ["./index.html", "./src/**/*.jsx", "./src/**/*.js"],
  },
  theme: {
    extend: {
      fontWeight: ["hover", "focus"],
      fontFamily: {
        sans: ["-apple-system", ...defaultTheme.fontFamily.sans],
        digital: ["Digital"],
      },
    },
  },
  variants: {},
  plugins: [],
};
