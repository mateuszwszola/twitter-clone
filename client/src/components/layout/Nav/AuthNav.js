import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { openCreateTweetModal } from 'actions/uiActions';
import DropdownMenu from './DropdownMenu';
import { Button, StyledNavLink } from 'shared/components';
import { MainNav, NavItem, StyledDropdown, NavAvatar } from './style';
import Search from 'components/Search';
import { useAuth } from 'context/AuthContext';

function AuthNav({ openCreateTweetModal }) {
  const [showMenu, setShowMenu] = useState(false);
  const avatarRef = useRef(null);
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleDropdown = (e) => {
      if (e.target === avatarRef.current) {
        return setShowMenu(!showMenu);
      }

      if (showMenu) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', handleDropdown);
    return () => document.removeEventListener('click', handleDropdown);
  }, [showMenu]);

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
          {showMenu ? <DropdownMenu user={user} onLogout={logout} /> : null}
        </StyledDropdown>
      </NavItem>
    </MainNav>
  );
}

AuthNav.propTypes = {
  openCreateTweetModal: PropTypes.func.isRequired,
};

export default connect(null, { openCreateTweetModal })(AuthNav);
