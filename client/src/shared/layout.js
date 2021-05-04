import styled from 'styled-components/macro';

const sizes = {
  phone: 768,
  tablet: 992,
  desktop: 1200,
};

export const queries = {
  tiny: `@media (max-width: ${sizes.phone}px)`,
  phone: `@media (min-width: ${sizes.phone}px)`,
  tablet: `@media (min-width: ${sizes.tablet}px)`,
  desktop: `@media (min-width: ${sizes.desktop}px)`,
};

const Wrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const Container = styled.div`
  width: 100%;
  max-width: 1300px;
  margin: 0 auto;
  padding: 10px 15px 30px;
`;

const Content = styled.div`
  flex: 1 0 auto;
`;

export { Wrapper, Container, Content };
