/** @type {import('tailwindcss').Config} */
export default {
  content: ['./components/*.{html,js,ts,vue}', './layouts/*.{html,js,ts,vue}', './pages/*.{html,js,ts,vue}', './app.vue'],
  plugins: [
    require('daisyui'),
    function ({ addBase, theme }) {
      function extractColorVars(colorObj, colorGroup = '') {
        return Object.keys(colorObj).reduce((vars, colorKey) => {
          const value = colorObj[colorKey];

          const newVars = typeof value === 'string' ? { [`--color${colorGroup}-${colorKey}`]: value } : extractColorVars(value, `-${colorKey}`);

          return { ...vars, ...newVars };
        }, {});
      }

      addBase({
        ':root': extractColorVars(theme('colors')),
      });
    },
    'tailwindcss-animated',
  ],
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: '#36B79B',
          secondary: '#C8D9D3',
          accent: '#FDCD61',
          neutral: '#414558',
          'base-100': '#C8D9D3',
          info: '#84ccbb',
          success: '#ABBB63',
          warning: '#F4B92D',
          error: '#FF5757',
        },
      },
    ],
  },
};
