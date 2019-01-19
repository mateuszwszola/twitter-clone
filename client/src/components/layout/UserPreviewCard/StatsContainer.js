import styled from 'styled-components';

const StatsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;

  @media screen and (min-width: 1170px) {
    justify-content: flex-start;
  }
`;

export default StatsContainer;
