import { queries } from 'shared/layout';
import styled from 'styled-components/macro';

export const Container = styled.li`
  flex: 1;
  padding: 10px;

  ${queries.phone} {
    flex: 50%;
  }
`;

export const FlexContainer = styled.div`
  padding: 10px 15px;
  border: 1px solid #eee;
  border-radius: 5px;
  height: 100%;
  display: flex;
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
  color: ${(props) => props.theme.colors.gray};
`;
