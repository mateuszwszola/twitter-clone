import styled from 'styled-components/macro';

export const Wrapper = styled.div`
  position: absolute;
  background-color: #f9f9f9;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  z-index: 1;
  right: 5%;
  border-radius: 4px;
`;

export const Menu = styled.ul`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

export const MenuItem = styled.li`
  width: 100%;
`;

export const MenuName = styled.span`
  color: #000;
  font-size: 1.2rem;
  font-weight: bold;
`;

export const MenuUsername = styled.span`
  color: gray;
`;

export const UserInfo = styled.div`
  padding: 7px 12px;
  border-bottom: 1px solid lightgray;
`;
