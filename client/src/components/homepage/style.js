import styled from 'styled-components/macro';

const Container = styled.main`
  padding: 0;
  display: flex;
  flex-direction: row;
  justify-content: center;
  flex-wrap: wrap;

  width: 100%;
  max-width: 1300px;
  margin: 0 auto;
  padding: 10px 15px;
`;

const LeftSidebar = styled.div`
  flex: 290px;
  max-width: 500px;
  margin: 0.7rem;
`;

const Main = styled.div`
  flex: 500px;
  max-width: 800px;
`;

const RightSidebar = styled.div`
  background-color: papayawhip;
  min-height: 200px;
  flex: 290px;
  max-width: 500px;
`;

export { Container, LeftSidebar, Main, RightSidebar };
