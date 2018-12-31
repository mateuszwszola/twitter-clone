import styled, { css } from 'styled-components';

const Button = styled.button`
  font-size: 1rem;
  padding: 0.7em 1em;
  margin: 5px;
  outline: 0;
  border-radius: 3px;
  cursor: pointer;

  ${props =>
    props.primary &&
    css`
      border-radius: 100px;
      font-size: 14px;
      line-height: 20px;
      padding: 6px 16px;
      text-align: center;
      color: #fff;
      background-color: #1da1f2;
    `}
`;

export default Button;
