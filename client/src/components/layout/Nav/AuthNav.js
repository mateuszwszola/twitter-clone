import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { openCreateTweetModal } from 'actions/uiActions';
import { logoutUser } from 'actions/authActions';
import DropdownMenu from './DropdownMenu';
import { Button, StyledNavLink } from 'shared/components';
import { MainNav, NavItem, StyledDropdown, NavAvatar } from './style';
import Search from 'components/Search';

function AuthNavView({
  openCreateTweetModal,
  avatarRef,
  showMenu,
  user,
  logoutUser
}) {
  return (
    <MainNav>
      <NavItem>
        <Search />
      </NavItem>
      <NavItem>
        <StyledNavLink to="/">
          <i className="fas fa-home" /> Home
        </StyledNavLink>
      </NavItem>
      <NavItem>
        <Button primary type="text" onClick={openCreateTweetModal}>
          Tweet
        </Button>
      </NavItem>
      <NavItem>
        <StyledDropdown>
          <NavAvatar className="fas fa-user-circle" ref={avatarRef} />
          {showMenu ? <DropdownMenu user={user} onLogout={logoutUser} /> : null}
        </StyledDropdown>
      </NavItem>
    </MainNav>
  );
}

AuthNavView.propTypes = {
  openCreateTweetModal: PropTypes.func.isRequired,
  showMenu: PropTypes.bool.isRequired,
  user: PropTypes.object,
  logoutUser: PropTypes.func.isRequired
};

function AuthNav({ user, logoutUser, openCreateTweetModal }) {
  const [showMenu, setShowMenu] = useState(false);
  const avatarRef = useRef(null);

  const handleDropdown = e => {
    if (e.target === avatarRef.current) {
      return setShowMenu(!showMenu);
    }

    if (showMenu) {
      setShowMenu(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleDropdown);
    return () => document.removeEventListener('click', handleDropdown);
  });

  return (
    <AuthNavView
      openCreateTweetModal={openCreateTweetModal}
      avatarRef={avatarRef}
      showMenu={showMenu}
      user={user}
      logoutUser={logoutUser}
    />
  );
}

AuthNav.propTypes = {
  user: PropTypes.object,
  logoutUser: PropTypes.func.isRequired,
  openCreateTweetModal: PropTypes.func.isRequired
};

const mapStateToProps = ({ auth }) => ({
  user: auth.user
});

export default connect(
  mapStateToProps,
  { logoutUser, openCreateTweetModal }
)(AuthNav);
