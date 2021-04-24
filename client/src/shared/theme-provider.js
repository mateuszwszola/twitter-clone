import React from 'react';
import { ThemeProvider } from 'styled-components/macro';

const theme = {
  colors: {
    primaryBlue: '#1da1f2',
    blue: '#29a3ef',
    darkerBlue: '#006dbf',
    green: '#3e8e41',
    red: '#E23D68',
    gray: '#67757E',
    darkGray: '#7B878F',
  },
};

const CustomThemeProvider = (props) => (
  <ThemeProvider theme={theme} {...props} />
);

export default CustomThemeProvider;
