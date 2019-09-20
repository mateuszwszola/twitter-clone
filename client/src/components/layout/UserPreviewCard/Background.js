import styled from 'styled-components';

const Background = styled.div`
  width: 100%;
  height: 50%;
  min-height: 100px;
  background: ${props => props.showColor ? props.theme.colors.blue : 'none'};
`;

export default Background;
