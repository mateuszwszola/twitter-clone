import styled, { css } from 'styled-components/macro';
import { Button as UIButton } from 'shared/components';

export const Wrapper = styled.div`
  z-index: 2;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
`;

export const Modal = styled.div`
  z-index: 3;
  position: absolute;
  top: 10%;
  left: 50%;
  transform: translateX(-50%);
  width: 80%;
  max-width: 500px;
  background-color: #fff;
  border-radius: 5px;
`;

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

export const Box = styled.div`
  background-color: rgba(29, 161, 242, 0.1);
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
  padding: 10px 15px;
`;

export const AvatarWrapper = styled.div``;

export const Avatar = styled.i`
  font-size: 2rem;
  color: gray;
  margin-top: 2px;
`;

export const Content = styled.div`
  width: 100%;
  padding-left: 10px;
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
  border-color: ${props => (props.error ? 'red' : 'lightblue')};
  min-height: 70px;
  resize: none;
`;

export const Button = styled(UIButton)`
  ${props =>
    props.disabled &&
    css`
      background-color: #9fd8fb;
    `}
`;
