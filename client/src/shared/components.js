import styled, { css } from 'styled-components/macro';
import { NavLink } from 'react-router-dom';
import Alert from '@reach/alert';

export const PrimaryHeading = styled.h1`
  text-align: center;
  margin: 1rem;
`;

export const SecondaryHeading = styled.h2``;

export const DisplayError = styled.p`
  text-align: center;
  font-size: 1rem;
  margin-top: 30px;
`;

export const InfoText = styled.p`
  text-align: center;
  padding: 10px 15px;
  font-size: 1.15em;
  color: ${(props) => props.theme.colors.darkGray};
`;

export const Input = styled.input`
  font-size: 1em;
  outline: none;
  display: block;
  width: 100%;
  margin: 10px 0;
  padding: 10px 5px;
  border: 1px solid
    ${(props) => (props.isError ? props.theme.colors.red : '#e6ecf0')};
  border-radius: 3px;

  :focus {
    border-color: ${(props) => props.theme.colors.darkGray};
  }
`;

export const Button = styled.button`
  font-size: 1rem;
  padding: 0.7em 1em;
  margin: 5px;
  outline: 0;
  border: 0;
  border-radius: 3px;
  cursor: pointer;

  ${(props) =>
    props.primary &&
    css`
      border-radius: 100px;
      font-size: 14px;
      line-height: 20px;
      padding: 6px 16px;
      text-align: center;
      color: ${({ theme }) => theme.colors.white};
      background-color: ${({ theme }) => theme.colors.primaryBlue};

      &:hover {
        background-color: ${({ theme }) => theme.colors.darkerBlue};
      }
    `}
`;

export const SignoutButton = styled.button`
  color: black;
  font-weight: normal;
  width: 100%;
  display: block;
  border-radius: 0px;
  padding: 12px;
`;

export const EditProfileButton = styled(Button)`
  border: 1px solid ${({ theme }) => theme.colors.gray};
  color: ${({ theme }) => theme.colors.gray};
  background-color: ${({ theme }) => theme.colors.white};
`;

export const BackButton = styled(Button)`
  border: 2px solid black;
  border-radius: 5px;
  color: black;
  background-color: ${({ theme }) => theme.colors.white};
`;

export const FollowProfileButton = styled(Button)`
  background-color: ${(props) => props.theme.colors.red};
  color: ${(props) => props.theme.colors.white};

  &:hover {
    background-color: #e23d69;
  }
`;

export const StyledNavLink = styled(NavLink)`
  padding: 15px;
  border-bottom: 2px solid transparent;
  font-weight: bold;
  color: #67757f;

  &.active {
    border-color: ${(props) => props.theme.colors.blue};
  }

  &:hover {
    border-color: ${(props) => props.theme.colors.blue};
    color: ${(props) => props.theme.colors.blue};
  }
`;

export const DropdownLink = styled(StyledNavLink)`
  color: black;
  font-weight: normal;
  width: 100%;
  display: block;
  border-radius: 0px;
`;

export const FeedbackMessage = styled(Alert)`
  color: ${(props) =>
    props.$isSuccess ? props.theme.colors.green : props.theme.colors.red};
  padding: 10px;
  font-size: 0.8rem;

  &:empty {
    display: none;
  }
`;

export const UserAvatar = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  flex-shrink: 0;
  margin: 0.7rem;

  ${(props) =>
    props.small &&
    css`
      width: 70px;
      height: 70px;
    `}
  ${(props) =>
    props.tiny &&
    css`
      width: 50px;
      height: 50px;
    `}
  ${(props) =>
    props.big &&
    css`
      width: 300px;
      height: 300px;
    `}
`;

export const CloseButton = styled.a`
  cursor: pointer;
  position: absolute;
  right: 32px;
  top: 32px;
  width: 32px;
  height: 32px;
  opacity: 0.3;
  &:hover {
    opacity: 1;
  }
  &:before,
  &:after {
    position: absolute;
    left: 15px;
    content: ' ';
    height: 33px;
    width: 2px;
    background-color: #fff;
  }
  &:before {
    transform: rotate(45deg);
  }
  &:after {
    transform: rotate(-45deg);
  }
`;

export const Icon = styled.span`
  font-size: 1.25em;
  color: ${(props) => props.theme.colors.gray};
  &:hover {
    color: ${(props) => props.theme.colors.darkGray};
  }
`;

export const LikeIcon = styled(Icon)`
  color: ${(props) =>
    props.liked ? props.theme.colors.red : props.theme.colors.gray};

  &:hover {
    color: ${(props) =>
      props.liked ? props.theme.colors.gray : props.theme.colors.red};
  }
`;
