import type { Config } from "tailwindcss";

/** Theme and plugins: `app/globals.css` (@import / @theme / @plugin). */
export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
} satisfies Config;
