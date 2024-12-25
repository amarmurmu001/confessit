import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        light: {
          ...require('daisyui/src/theming/themes')['light'],
          primary: '#ec4899', // pink-600
          'primary-content': '#ffffff',
          secondary: '#fdf2f8', // pink-50
          accent: '#fce7f3', // pink-100
          neutral: '#f9fafb', // gray-50
          'base-100': '#ffffff',
          'base-content': '#111827', // gray-900
        },
        dark: {
          ...require('daisyui/src/theming/themes')['dark'],
          primary: '#ec4899', // pink-600
          'primary-content': '#ffffff',
          secondary: '#831843', // pink-900
          accent: '#be185d', // pink-700
          neutral: '#1f2937', // gray-800
          'base-100': '#111827', // gray-900
          'base-content': '#f9fafb', // gray-50
        },
      },
    ],
  },
}

export default config;
