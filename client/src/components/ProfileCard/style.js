import styled from 'styled-components/macro';

export const Container = styled.div`
  min-width: 250px;
  max-height: 100px;
  border-radius: 5px;
  box-shadow: 1px 1px 5px 0px ${props => props.theme.colors.red};
  padding: 10px 15px;
  margin: 0.5rem 1rem;
`;

export const FlexContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
`;

export const TextContainer = styled.div`
    margin: 0.7em;
    display: flex;
    flex-direction: column;
`;

export const StyledName = styled.p`
  font-weight: bold;
`;

export const StyledUsername = styled.p`
  color: ${props => props.theme.colors.gray};
`;
