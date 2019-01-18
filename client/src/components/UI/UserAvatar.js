import styled, { css } from 'styled-components';

export const UserAvatar = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  border: 2px solid #fff;
  flex-shrink: 0;

  ${props =>
    props.small &&
    css`
      width: 50px;
      height: 50px;
    `}

  ${props =>
    props.big &&
    css`
      width: 300px;
      height: 300px;
    `}
`;
