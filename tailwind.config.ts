import daisyui from 'daisyui';
import { Config } from 'tailwindcss';

const config: Config = {
  content: ['./components/*.{html,js,ts,vue}', './layouts/*.{html,js,ts,vue}', './pages/*.{html,js,ts,vue}', './app.vue'],
  plugins: [require('prettier-plugin-tailwindcss'), daisyui],
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: '#01AB87',
          secondary: '#C8D9D3',
          accent: '#FDCD61',
          neutral: '#414558',
          'base-100': '#C8D9D3',
          info: '#36B79B',
          success: '#ABBB63',
          warning: '#F4B92D',
          error: '#FF5757',
        },
      },
    ],
  },
};

export default config;
