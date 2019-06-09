import React, { Component, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button } from '../../UI/Button';
import { StyledNavLink } from '../../UI/Links';
import DropdownMenu from './DropdownMenu';
import { openCreateTweetModal } from '../../../actions/uiActions';

const AuthNav = ({ user, openCreateTweetModal, onLogout }) => {
  const [showMenu, setShowMenu] = useState(false);
  const avatarRef = React.createRef();

  const hideMenu = e => {
    if (e.target !== avatarRef.current) {
      setShowMenu(true);
    }
  };

  const toggleMenu = () => {
    setShowMenu(showMenu === true ? false : true);
    console.log({ showMenu });
  };

  useEffect(() => {
    document.addEventListener('click', hideMenu);
    return () => document.removeEventListener('click', hideMenu);
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
            onClick={toggleMenu}
            className="fas fa-user-circle nav__avatar dropdown-button"
            ref={avatarRef}
          />
          {showMenu ? <DropdownMenu user={user} onLogout={onLogout} /> : null}
        </div>
      </li>
    </nav>
  );
};

// class AuthNav extends Component {
//   state = {
//     showMenu: false,
//     message: ''
//   };

//   avatarRef = React.createRef();

//   componentDidMount() {
//     document.addEventListener('click', this.hideMenu);
//   }

//   componentWillUnmount() {
//     document.removeEventListener('click', this.hideMenu);
//   }

//   hideMenu = e => {
//     if (e.target !== this.avatarRef.current) {
//       this.setState(() => ({
//         showMenu: false
//       }));
//     }
//   };

//   toggleMenu = () => {
//     this.setState(({ showMenu }) => ({
//       showMenu: !showMenu
//     }));
//   };

//   showTempMessage = message => {
//     this.setState(() => ({ message }));
//     setTimeout(() => this.setState(() => ({ message: '' })), 3000);
//   };

//   render() {
//     const { user, openCreateTweetModal } = this.props;

//     return (
//       <nav className="main-nav">
//         {this.state.message ? (
//           <div
//             style={{
//               color: 'green',
//               fontWeight: 'bold',
//               position: 'absolute',
//               left: '50%',
//               top: '0',
//               padding: '10px 15px',
//               transform: 'translateX(-50%)'
//             }}
//           >
//             {this.state.message}
//           </div>
//         ) : (
//           ''
//         )}
//         <li className="nav__item">
//           <StyledNavLink to="/">
//             <i className="fas fa-home" /> Home
//           </StyledNavLink>
//         </li>
//         <li className="nav__item">
//           <Button primary type="text" onClick={openCreateTweetModal}>
//             Tweet
//           </Button>
//         </li>
//         <li className="nav__item">
//           <div className="dropdown">
//             <i
//               onClick={this.toggleMenu}
//               className="fas fa-user-circle nav__avatar dropdown-button"
//               ref={this.avatarRef}
//             />
//             {this.state.showMenu ? (
//               <DropdownMenu user={user} onLogout={this.props.onLogout} />
//             ) : null}
//           </div>
//         </li>
//       </nav>
//     );
//   }
// }

AuthNav.propTypes = {
  user: PropTypes.object.isRequired,
  onLogout: PropTypes.func.isRequired,
  openCreateTweetModal: PropTypes.func.isRequired
};

export default connect(
  null,
  { openCreateTweetModal }
)(AuthNav);
