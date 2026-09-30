export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#00695C", surface: "#F7F9FB", ink: "#191C1E",
        muted: "#5B6B68", line: "#D9E2E0", tint: "#E2F4F1", danger: "#BA1A1A",
      },
      fontFamily: { sans: ['"Plus Jakarta Sans"', "system-ui", "sans-serif"] },
    },
  },
  plugins: [],
};
