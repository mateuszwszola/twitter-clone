import styled from 'styled-components/macro';

const Container = styled.main`
  display: flex;
  flex-direction: row;
  justify-content: center;
  flex-wrap: wrap;

  width: 100%;
  max-width: 1300px;
  height: 100%;
  margin: 0 auto;
  padding: 10px 15px;
`;

const LeftSidebar = styled.div`
  position: relative;
  flex: 290px;
  max-width: 500px;
  margin: 0 0.7rem;
`;

const Main = styled.div`
  flex: 500px;
  max-width: 800px;
  height: 100%;
`;

const RightSidebar = styled.div`
  min-height: 200px;
  flex: 290px;
  max-width: 500px;
  margin: 0 0.7em;
`;

export { Container, LeftSidebar, Main, RightSidebar };
