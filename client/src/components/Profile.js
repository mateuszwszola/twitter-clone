import React from 'react';
// import PropTypes from 'prop-types';
import Moment from 'react-moment';
import { Link } from 'react-router-dom';
import { EditProfileButton } from './UI/Button';
import { UserAvatar } from './layout/Profile/UserAvatar';
import avatar from '../img/tiger-avatar-example.jpg';

const profile = {
  created: '2018-12-30T14:29:19.341Z',
  followers: [],
  following: [],
  likes: [],
  tweets: [],
  user: {
    id: '5c28d63f90062ff8bd1dba8e',
    name: 'Dennis Doe',
    username: 'dennisdoe'
  }
};

const tweets = [
  {
    id: 1,
    text: '“The most effective way to do it - is to do it.” - Amelia Earhart',
    created: '2017-10-30T14:29:19.341Z',
    user: {
      id: '5c28d63f90062ff8bd1dba8e',
      name: 'Dennis Doe',
      username: 'dennisdoe'
    },
    media: null,
    comments: [{}, {}],
    likes: [{}, {}, {}, {}],
    retweets: [{}, {}, {}, {}]
  },
  {
    id: 2,
    text:
      'If you know any young person/student who is unsure about their life purpose, pass this on. Super life advice from @marieforleo via @tferriss book “Tribe of Mentors”. Check out the quote in the middle... Wow #purpose',
    created: '2018-05-30T14:29:19.341Z',
    user: {
      id: '5c28d63f90062ff8bd1dba8e',
      name: 'Bob Doe',
      username: 'bobdoe'
    },
    media: null,
    comments: [{}, {}],
    likes: [{}, {}, {}, {}],
    retweets: [{}, {}, {}, {}]
  }
];

const UserInfo = () => (
  <div className="profile-user-info">
    <UserAvatar src={avatar} alt="User Avatar" />
    <h1 className="user-info-name">
      <Link to={`/${profile.user.username}`} className="user-info-link">
        {profile.user.name}
      </Link>
    </h1>
    <p className="user-info-username">
      @
      <Link to={`/${profile.user.username}`} className="user-info-link">
        {profile.user.username}
      </Link>
    </p>
    <p className="user-info-joined">
      <i className="fas fa-calendar-alt" /> Joined{' '}
      <Moment format="MMMM YYYY" withTitle>
        {profile.created}
      </Moment>
    </p>
  </div>
);

const ProfileHeader = () => (
  <div className="profile-header-menu">
    <ul className="header-menu-list">
      <li className="header-menu-list-item">
        <span className="header-menu-list-item-key">Tweets</span>
        <span className="header-menu-list-item-value">17</span>
      </li>
      <li className="header-menu-list-item">
        <span className="header-menu-list-item-key">Following</span>
        <span className="header-menu-list-item-value">30</span>
      </li>
      <li className="header-menu-list-item">
        <span className="header-menu-list-item-key">Followers</span>
        <span className="header-menu-list-item-value">3</span>
      </li>
      <li className="header-menu-list-item">
        <span className="header-menu-list-item-key">Likes</span>
        <span className="header-menu-list-item-value">46</span>
      </li>
    </ul>
  </div>
);

const ProfileBoard = () => (
  <div className="profile-board-container">
    Profile board container
    <div className="profile-board">
      <div className="profile-board-header">
        <h3>Tweets</h3>
      </div>
      <div className="profile-board-content">
        <ul className="profile-board-list">
          {tweets.map(tweet => (
            <li key={tweet.id} className="profile-board-list-item">
              <div className="tweet-user-group">
                <span className="tweet-user-name-group">
                  <strong className="tweet-user-name">{tweet.user.name}</strong>
                </span>
                <span className="tweet-user-username-group">
                  @<b>{tweet.user.username}</b>
                </span>
                <span className="tweet-user-created-group">
                  {tweet.created}
                </span>
              </div>
              <div className="tweet-content-group">
                <p className="tweet-text">{tweet.text}</p>
              </div>
              <div className="tweet-bottom-group">
                <span className="tweet-comments-info">
                  @{tweet.comments.length}
                </span>
                <span className="tweet-retweets-info">
                  @{tweet.retweets.length}
                </span>
                <span className="tweet-likes-info">@{tweet.likes.length}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
);

function Profile() {
  return (
    <div className="profile-container">
      <div className="profile-background-place" />
      <EditProfileButton primary>Edit Profile</EditProfileButton>
      <UserInfo />
      <ProfileHeader />
      <ProfileBoard />
    </div>
  );
}

// Profile.propTypes = {
//   profile: PropTypes.object.isRequired
// };

export default Profile;
