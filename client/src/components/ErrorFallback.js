import Alert from '@reach/alert';
import styled from 'styled-components/macro';

const StyledAlert = styled(Alert)`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

function ErrorFallback({ error }) {
  return (
    <StyledAlert>
      <p>Something went wrong... Sorry</p>
      <pre style={{ color: 'red' }}>{error.message}</pre>
    </StyledAlert>
  );
}

export default ErrorFallback;
