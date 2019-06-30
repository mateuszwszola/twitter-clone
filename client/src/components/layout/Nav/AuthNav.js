import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import DropdownMenu from './dropdownMenu';
import { Button } from '../../UI/button';
import { StyledNavLink } from '../../UI/links';
import { openCreateTweetModal } from '../../../actions/uiActions';
import { logoutUser } from '../../../actions/authActions';

const AuthNav = ({ user, logoutUser, openCreateTweetModal }) => {
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
    <nav className="main-nav">
      <li className="nav__item">
        <StyledNavLink to="/">
          <i className="fas fa-home" /> Home
        </StyledNavLink>
      </li>
      <li className="nav__item">
        <Button primary type="text" onClick={openCreateTweetModal}>
          Tweet
        </Button>
      </li>
      <li className="nav__item">
        <div className="dropdown">
          <i
            className="fas fa-user-circle nav__avatar dropdown-button"
            ref={avatarRef}
          />
          {showMenu ? <DropdownMenu user={user} onLogout={logoutUser} /> : null}
        </div>
      </li>
    </nav>
  );
};

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
