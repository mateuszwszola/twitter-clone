import React from 'react';
import { ThemeProvider } from 'styled-components/macro';

const theme = {
  colors: {
    primaryBlue: '#1da1f2',
    blue: '#29a3ef',
    darkerBlue: '#006dbf',
    green: '#3e8e41',
    red: '#E23D68',
    gray: '#7A7A7A',
    darkGray: '#474747',
    black: '#000',
    white: '#fff',
  },
};

const CustomThemeProvider = (props) => (
  <ThemeProvider theme={theme} {...props} />
);

export default CustomThemeProvider;
