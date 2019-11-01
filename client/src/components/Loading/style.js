import styled from 'styled-components/macro';

export const Spinner = styled.div`
  @keyframes lds-heart {
      0% {
        transform: scale(0.95);
      }
      5% {
        transform: scale(1.1);
      }
      39% {
        transform: scale(0.85);
      }
      45% {
        transform: scale(1);
      }
      60% {
        transform: scale(0.95);
      }
      100% {
        transform: scale(0.9);
      }
  }
  
  top: 23px;
  left: 19px;
  position: absolute;
  width: 26px;
  height: 26px;
  background: ${props => props.theme.colors.red};
  animation: lds-heart 1.2s infinite cubic-bezier(0.215, 0.61, 0.355, 1);
  
  &:after,
  &:before {
      content: " ";
      position: absolute;
      display: block;
      width: 26px;
      height: 26px;
      background: ${props => props.theme.colors.red};
  }
  
  &:before {
      left: -17px;
      border-radius: 50% 0 0 50%;
  }
   &:after {
      top: -17px;
      border-radius: 50% 50% 0 0;
  }
`;

export const Wrapper = styled.div`
  display: inline-block;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(45deg);
  width: 64px;
  height: 64px;
  transform-origin: 32px 32px;
`;