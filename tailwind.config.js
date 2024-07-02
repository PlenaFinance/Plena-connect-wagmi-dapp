module.exports = {
  corePlugins: {
    preflight: false,
  },
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      backgroundColor: {
        '985AFF': '#985AFF',
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        '.w-426': {
          width: '426px',
        },
        '.h-100':{
          height: '95vh'
        }
      };

      addUtilities(newUtilities, ['responsive', 'hover']);
    },
  ],
}