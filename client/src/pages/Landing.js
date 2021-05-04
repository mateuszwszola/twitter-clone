import React from 'react';
import { Container } from 'shared/layout';
import { PrimaryHeading, SecondaryHeading } from 'shared/components';
import styled from 'styled-components/macro';

const LandingContainer = styled.div`
  text-align: center;
  margin-top: 50px;
`;

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
