import { Config } from 'tailwindcss'
import plugin from 'tailwindcss/plugin'
import defaultTheme from 'tailwindcss/defaultTheme'

const pxToRem = (dest: number) => 1 / (16 / dest)

export default <Config>{
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      zIndex: {
        min: '-1',
        1: '1',
        2: '2',
        100: '100',
        max: '9999',
      },
    },
    // screens: {
    //   sm: `${pxToRem(375)}rem`,
    // },
    container: {
      padding: `${pxToRem(76)}rem`,
    },
    colors: {
      light: '#FFFFFF',
      dark: '#000000',
      darkblur: 'rgba(0,0,0,.6)',
      grey: {
        50: '#D4D4D4',
        75: '#BDBDBD',
        100: '#626262',
        200: '#333333',
        300: '#282828',
        400: '#1B1B1B',
        500: '#121212',
      },
      red: {
        200: '#FFAEAE',
        900: '#2A2222',
      },
      green: {
        200: '#AEFFB6',
        900: '#232A22',
      },
      transparent: 'transparent',
      current: 'currentColor',
    },
    borderRadius: {
      none: '0',
      sm: `${pxToRem(8)}rem`,
      DEFAULT: `${pxToRem(12)}rem`,
      circle: '100%',
      full: '9999px',
    },
    boxShadow: {
      DEFAULT: '0px 16px 32px 0px rgba(0,0,0,0.1)px',
    },
    fontFamily: {
      interVar: ['"Inter var"', defaultTheme.fontFamily.sans],
      interNormal: ['Inter', defaultTheme.fontFamily.sans],
      termina: ['Termina', defaultTheme.fontFamily.sans],
    },
    fontSize: {
      0: '0',
      50: `${pxToRem(11)}rem`,
      100: `${pxToRem(13)}rem`,
      200: `${pxToRem(17)}rem`,
      300: `${pxToRem(21)}rem`,
      400: `${pxToRem(26)}rem`,
      500: `${pxToRem(32)}rem`,
      600: `${pxToRem(40)}rem`,
      700: `${pxToRem(56)}rem`,
      800: `${pxToRem(76)}rem`,
      900: `${pxToRem(96)}rem`,
    },
  },
}
