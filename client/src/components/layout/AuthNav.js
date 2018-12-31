import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Button from '../UI/Button';

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
    const { user, authenticateUser } = this.props;
    return (
      <nav className="main-nav">
        <li className="nav__item">
          <Link to="/">Home</Link>
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
            {this.state.showMenu ? (
              <DropdownMenu user={user} authenticateUser={authenticateUser} />
            ) : null}
          </div>
        </li>
      </nav>
    );
  }
}

function DropdownMenu({ user, authenticateUser }) {
  return (
    <div className="dropdown-content">
      <ul className="dropdown-menu">
        <div className="dropdown__user-info">
          <li className="dropdown-menu__item dropdown__name">{user.name}</li>
          <li className="dropdown-menu__item dropdown__username">
            @{user.username}
          </li>
        </div>
        <li className="dropdown-menu__item">
          <Link to="/profile">Profile</Link>
        </li>
        <li className="dropdown-menu__item">
          <Link to="/settings">Settings</Link>
        </li>
        <li className="dropdown-menu__item">
          <Link to="/notfound">404 not found</Link>
        </li>
        <li className="dropdown-menu__item">
          <Link to="/logout" onClick={() => console.log('Log out')}>
            Log Out
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default AuthNav;
