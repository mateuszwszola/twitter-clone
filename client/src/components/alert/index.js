import React from 'react';
import ReachAlert from '@reach/alert';
import styled from 'styled-components/macro';
import { useAlert } from 'context/AlertContext';
import { IoMdClose } from 'react-icons/io';

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const StyledAlert = styled(ReachAlert)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  width: 100%;
  background-color: ${(props) =>
    props.alertType === 'success'
      ? 'rgba(0, 255, 0, 0.2)'
      : 'rgba(255, 0, 0, 0.2)'};

  &:empty {
    display: none;
  }

  & + & {
    margin-top: 10px;
  }
`;

const CloseButton = styled.button`
  cursor: pointer;
  background: none;
  border: none;
  display: flex;
  align-items: center;
`;

function DisplayAlerts() {
  const { alerts, removeAlert } = useAlert();

  if (!alerts || !alerts.length) {
    return null;
  }

  return (
    <Container>
      {alerts.map((alert) => (
        <StyledAlert key={alert.id} alertType={alert.type}>
          {alert.msg}
          <CloseButton onClick={() => removeAlert(alert.id)} aria-label="Close">
            <IoMdClose
              css={`
                font-size: 1.3rem;
              `}
            />
          </CloseButton>
        </StyledAlert>
      ))}
    </Container>
  );
}

export default DisplayAlerts;
