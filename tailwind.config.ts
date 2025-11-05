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
        // This is where you define your colors
        'party-green': '#0B9421',
        'party-red': '#d91c1c',
      },
      fontFamily: {
        'noto-sans-tamil': ['"Noto Sans Tamil"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config