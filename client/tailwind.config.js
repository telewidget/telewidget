/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        accent: "var(--tw-accent, #ffcc00)", // Example default, should match original
        background: "var(--tw-background, #ffffff)",
        foreground: "var(--tw-foreground, #000000)",
        muted: "var(--tw-muted, #666666)",
      }
    },
  },
  plugins: [],
}
