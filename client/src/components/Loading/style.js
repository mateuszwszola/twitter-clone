import styled, { keyframes } from 'styled-components/macro';

const rotate = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

export const Spinner = styled.div`
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;

  transform: ${(props) => (props.isSmall ? 'scale(0.5)' : 'scale(1)')};

  & div {
    box-sizing: border-box;
    display: block;
    position: absolute;
    width: 64px;
    height: 64px;
    margin: 8px;
    border: 8px solid ${({ theme }) => theme.colors.primaryBlue};
    border-radius: 50%;
    animation: ${rotate} 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
    border-color: ${({ theme }) => theme.colors.primaryBlue} transparent
      transparent transparent;

    &:nth-child(1) {
      animation-delay: -0.45s;
    }
    &:nth-child(2) {
      animation-delay: -0.3s;
    }
    &:nth-child(3) {
      animation-delay: -0.15s;
    }
  }
`;

export const Wrapper = styled.div`
  position: ${(props) => (props.isFixed ? 'fixed' : 'absolute')};
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;
