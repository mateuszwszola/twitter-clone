import React from 'react';
import { withRouter } from 'react-router-dom';
import { Container } from 'shared/layout';
import { BackButton } from 'shared/components';
import styled from 'styled-components/macro';

const Box = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
`;

const Message = styled.h1`

`;

function NotFoundPage({ message, history }) {
    return (
        <Container>
            <Box>
                <Message>{message}</Message>
                <BackButton onClick={() => history.goBack()}>Go back</BackButton>
            </Box>
        </Container>
    )
}

NotFoundPage.defaultProps = {
  message: 'Not Found'
};

export default withRouter(NotFoundPage);