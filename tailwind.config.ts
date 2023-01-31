import { withAnimations } from 'animated-tailwindcss';
import daisyui from 'daisyui';

const config = withAnimations({
  mode: 'jit',
  content: ['./components/*.{html,js,ts,vue}', './layouts/*.{html,js,ts,vue}', './pages/*.{html,js,ts,vue}', './app.vue'],
  plugins: [
    require('prettier-plugin-tailwindcss'),
    daisyui,
    function ({ addBase, theme }: { addBase: any; theme: any }) {
      function extractColorVars(colorObj: any, colorGroup = ''): any {
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
});

export default config;
