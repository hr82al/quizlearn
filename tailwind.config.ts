import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        main: {
          light: "#38bdf8",
          base: "#075985",
          lightest: "#bae6fd",
          dark: "#0c4a6e",
          darkest: "#082f49"
        }
      },
      minWidth: {
        '8': '2rem',
        '4': '1rem',
      }
    },
  },
  plugins: [],
}
export default config
