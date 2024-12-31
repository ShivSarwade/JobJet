/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        'faq': ' rgba(0, 0, 0, 0.35) 0px 5px 15px;',
      },
      screens: {
        'xs': '300px',
      },
      fontFamily: {
        logo: ['Comfortaa', 'serif'],
        primary: ['Poppins', 'serif'],
      },
      colors: {
        primaryText: '#000000',
        primary: '#0059ce',
        accent: '#ef4d36',
        primaryBackground: '#F7FEFF',
        navBackground: '#fff',
        accentText: '#white',
        darkBackground: '#0a192f',
        sectionBackground: '#e0eff2',
        darkSection: '#273e68',
        navShadow:'#001bff12'
      },
      spacing: {
        navHeight: '4rem',
        sectionHeight: 'calc(100vh - 4rem)'
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}

