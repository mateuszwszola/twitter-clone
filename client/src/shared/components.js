import styled, { css } from 'styled-components/macro';
import { NavLink } from 'react-router-dom';

const PrimaryHeading = styled.h1``;

const SecondaryHeading = styled.h2``;

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
      background-color: ${props => props.theme.colors.primaryBlue};
    `}
`;

const SignoutButton = styled.button`
  color: black;
  font-weight: normal;
  width: 100%;
  display: block;
  border-radius: 0px;
  padding: 12px;
`;

const EditProfileButton = styled(Button)`
  border: 1px solid #67757f;
  color: #67757f;
  background-color: #fff;
  align-self: flex-end;
`;

const FollowProfileButton = styled(EditProfileButton)`
  background-color: #f34c79;
  color: #fff;
  border: none;

  &:hover {
    background-color: #e23d69;
  }
`;

const StyledNavLink = styled(NavLink)`
  padding: 15px;
  border-bottom: 2px solid transparent;
  font-weight: bold;

  &:hover {
    border-color: #29a3ef;
    color: #29a3ef;
  }
`;

const DropdownLink = styled(StyledNavLink)`
  color: black;
  font-weight: normal;
  width: 100%;
  display: block;
  border-radius: 0px;
`;

const FeedbackMessage = styled.div`
  color: ${props =>
    props.success ? props.theme.colors.green : props.theme.colors.red};
  padding: 10px;
  font-size: 0.8rem;
`;

const UserAvatar = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  border: 2px solid #fff;
  flex-shrink: 0;
  margin: 0.7rem;

  ${props =>
    props.small &&
    css`
      width: 70px;
      height: 70px;
    `}

  ${props =>
    props.big &&
    css`
      width: 300px;
      height: 300px;
    `}
`;

export {
  PrimaryHeading,
  SecondaryHeading,
  Button,
  SignoutButton,
  EditProfileButton,
  FollowProfileButton,
  StyledNavLink,
  DropdownLink,
  FeedbackMessage,
  UserAvatar
};
