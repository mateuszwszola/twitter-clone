import styled, { css } from 'styled-components/macro';
import { Button as UIButton } from 'shared/components';

export const Header = styled.div`
  text-align: center;
  position: relative;
`;

export const Title = styled.h3`
  padding: 15px 0;
  font-size: 1.1rem;
`;

export const CloseButton = styled.button`
  color: gray;
  position: absolute;
  right: 0;
  top: 0;
  cursor: pointer;
  padding: 15px;
  font-size: 1.2rem;
`;

export const Content = styled.div`
  margin-top: 15px;
  width: 100%;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

export const Textarea = styled.textarea`
  border-radius: 5px;
  font-size: 15px;
  padding: 5px;
  width: 100%;
  border: 2px solid;
  border-color: ${(props) => (props.error ? 'red' : 'lightblue')};
  min-height: 70px;
  resize: none;
  margin-top: 10px;
`;

export const Button = styled(UIButton)`
  ${(props) =>
    props.disabled &&
    css`
      background-color: #9fd8fb;
    `}
`;
