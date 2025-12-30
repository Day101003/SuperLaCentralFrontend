/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': {
          DEFAULT: '#1e1b4b', // Azul marino oscuro
          50: '#f5f5ff',
          100: '#ebebff',
          200: '#d6d6ff',
          300: '#b3b3ff',
          400: '#8080ff',
          500: '#4d4dff',
          600: '#1e1b4b',
          700: '#16143a',
          800: '#0f0d29',
          900: '#080718',
        },
        'secondary': {
          DEFAULT: '#fbbf24', // Amarillo dorado
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
      },
    },
  },
  plugins: [],
}
