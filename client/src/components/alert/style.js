import styled from 'styled-components/macro';

export const Container = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  z-index: 100;
`

export const StyledAlert = styled.div`
  margin: 10px;
  background-color: ${props =>
    props.type === 'success'
      ? props.theme.colors.green
      : props.theme.colors.red};
  color: white;
  border-radius: 3px;
  padding: 10px 15px;
  box-shadow: 2px 3px 5px 0px rgba(0, 0, 0, 0.75);
  z-index: 100;

  &:empty {
    display: none;
  }
`;
