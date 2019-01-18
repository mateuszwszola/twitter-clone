import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from '../../UI/Button';
import { StyledNavLink } from '../../UI/Links';
import DropdownMenu from './DropdownMenu';

class AuthNav extends Component {
  state = {
    showMenu: false
  };

  avatarRef = React.createRef();

  componentDidMount() {
    document.addEventListener('click', this.hideMenu);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.hideMenu);
  }

  hideMenu = e => {
    if (e.target !== this.avatarRef.current) {
      this.setState(() => ({
        showMenu: false
      }));
    }
  };

  toggleMenu = () => {
    this.setState(({ showMenu }) => ({
      showMenu: !showMenu
    }));
  };

  render() {
    const { user } = this.props;
    return (
      <nav className="main-nav">
        <li className="nav__item">
          <StyledNavLink to="/">
            <i className="fas fa-home" /> Home
          </StyledNavLink>
        </li>
        <li className="nav__item">
          <Button primary type="text">
            Tweet
          </Button>
        </li>
        <li className="nav__item">
          <div className="dropdown">
            <i
              onClick={this.toggleMenu}
              className="fas fa-user-circle nav__avatar dropdown-button"
              ref={this.avatarRef}
            />
            {this.state.showMenu ? <DropdownMenu user={user} /> : null}
          </div>
        </li>
      </nav>
    );
  }
}

AuthNav.propTypes = {
  user: PropTypes.object.isRequired,
  authenticateUser: PropTypes.func.isRequired
};

export default AuthNav;
