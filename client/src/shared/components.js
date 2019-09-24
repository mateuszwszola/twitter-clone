import styled, { css } from 'styled-components/macro';
import { NavLink } from 'react-router-dom';

export const PrimaryHeading = styled.h1`
  text-align: center;
  margin: 1rem;
`;

export const SecondaryHeading = styled.h2``;

export const InfoText = styled.p`
  text-align: center;
  padding: 10px 15px;
  font-size: 1.15em;
  color: ${props => props.theme.colors.darkGray};
`;

export const Input = styled.input`
  font-size: 1em;
  outline: none;
  display: block;
  width: 100%;
  margin: 10px 0;
  padding: 10px 5px;
  border: 1px solid
    ${props => (props.error ? props.theme.colors.red : '#e6ecf0')};
  border-radius: 3px;

  :focus {
    border-color: #cadae4;
  }
`;

export const Button = styled.button`
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
      background-color: ${props => props.theme.colors.primaryBlue};
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
  border: 1px solid #67757f;
  color: #67757f;
  background-color: #fff;
  align-self: flex-end;
`;

export const BackButton = styled(Button)`
  border: 2px solid black;
  border-radius: 5px;
  color: black;
  background-color: #fff;
`;

export const FollowProfileButton = styled(EditProfileButton)`
  background-color: #f34c79;
  color: #fff;
  border: none;

  &:hover {
    background-color: #e23d69;
  }
`;

export const StyledNavLink = styled(NavLink)`
  padding: 15px;
  border-bottom: 2px solid transparent;
  font-weight: bold;

  &:hover {
    border-color: #29a3ef;
    color: #29a3ef;
  }
`;

export const DropdownLink = styled(StyledNavLink)`
  color: black;
  font-weight: normal;
  width: 100%;
  display: block;
  border-radius: 0px;
`;

export const FeedbackMessage = styled.div`
  color: ${props =>
    props.success ? props.theme.colors.green : props.theme.colors.red};
  padding: 5px;
  font-size: 0.8rem;
`;

export const UserAvatar = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  flex-shrink: 0;
  margin: 0.7rem;

  ${props =>
    props.small &&
    css`
      width: 70px;
      height: 70px;
    `}
  ${props =>
    props.tiny &&
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

export const ProfileBackground = styled.img`
  object-fit: cover;
  width: 100%;
  max-width: 100%;
  height: 100%;
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
