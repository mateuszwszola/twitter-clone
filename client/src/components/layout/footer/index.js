import React from 'react';
import { StyledFooter, Text } from './style';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <StyledFooter>
      <Text>{currentYear} Twitter Clone</Text>
    </StyledFooter>
  );
}
