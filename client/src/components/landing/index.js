import React from 'react';
import { Container } from '../../shared/layout';
import { LandingContainer } from './style';
import { PrimaryHeading, SecondaryHeading } from '../../shared/components';

function Landing() {
  return (
    <Container>
      <LandingContainer>
        <PrimaryHeading>Twitter Clone</PrimaryHeading>
        <SecondaryHeading>
          Please Sign In, or Sign Up if you don't have an account yet
        </SecondaryHeading>
      </LandingContainer>
    </Container>
  );
}

export default Landing;
