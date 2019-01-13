import styled, { css } from 'styled-components';

export const UserAvatar = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  border: 2px solid #fff;

  ${props =>
    props.big &&
    css`
      width: 300px;
      height: 300px;
    `}
`;
