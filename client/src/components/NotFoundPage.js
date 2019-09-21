import React from 'react';
import { Link } from 'react-router-dom';
import { Container } from 'shared/layout';
import { BackButton } from 'shared/components';
import styled from 'styled-components/macro';

const Box = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  display: flex;
  flex-direction: column;
`;

const Message = styled.h1``;

function NotFoundPage({ message }) {
    return (
        <Container>
            <Box>
                <Message>{message}</Message>
                <BackButton as={Link} to="/">Visit Homepage</BackButton>
            </Box>
        </Container>
    )
}

NotFoundPage.defaultProps = {
  message: '404 - Page Not Found'
};

export default NotFoundPage;