import { extendTheme } from '@chakra-ui/react';

const colors = {
  brand: {
    900: '#1a365d',
    800: '#153e75',
    700: '#2a69ac',
  },
};

const fonts = {
  heading: 'Montserrat, sans-serif',
  body: 'Montserrat, sans-serif',
};

const fontSizes = {
  xs: '12px',
  sm: '14px',
  md: '15px',
  lg: '18px',
  xl: '20px',
  '2xl': '24px',
  '3xl': '32px',
  '3xl+': '36px',
  '4xl': '48px',
  '5xl': '72px',
};

const styles = {
  global: {
    'html, body, #__next': {
      minHeight: '100vh',
    },
  },
};

export const theme = extendTheme({ colors, styles, fonts, fontSizes });
