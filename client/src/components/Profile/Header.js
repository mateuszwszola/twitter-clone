import React from 'react';
import PropTypes from 'prop-types';

const Header = ({ profile }) => (
  <div className="profile-header-menu">
    <ul className="header-menu-list">
      <li className="header-menu-list-item">
        <span className="header-menu-list-item-key">Tweets</span>
        <span className="header-menu-list-item-value">
          {profile.tweets.length}
        </span>
      </li>
      <li className="header-menu-list-item">
        <span className="header-menu-list-item-key">Following</span>
        <span className="header-menu-list-item-value">
          {profile.following.length}
        </span>
      </li>
      <li className="header-menu-list-item">
        <span className="header-menu-list-item-key">Followers</span>
        <span className="header-menu-list-item-value">
          {profile.followers.length}
        </span>
      </li>
      <li className="header-menu-list-item">
        <span className="header-menu-list-item-key">Likes</span>
        <span className="header-menu-list-item-value">
          {profile.likes.length}
        </span>
      </li>
    </ul>
  </div>
);

Header.propTypes = {
  profile: PropTypes.object.isRequired
};

export default Header;
