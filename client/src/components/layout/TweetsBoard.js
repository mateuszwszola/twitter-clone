import React from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import { UserAvatar } from '../UI/userAvatar';
// import avatar from '../../img/tiger-avatar-example.jpg';

const TweetsBoard = ({ tweets }) => (
  <div className="tweets-board-container">
    <div className="tweets-board">
      <div className="tweets-board-header">
        <h3>Tweets</h3>
      </div>
      <div className="tweets-board-content">
        <ul className="tweets-board-list">
          {tweets.length > 0 ? (
            tweets.map(tweet => (
              <li key={tweet._id} className="tweets-board-list-item">
                <UserAvatar
                  small
                  src="https://picsum.photos/200"
                  alt="User Avatar"
                />
                <div className="tweets-board-list-item-content">
                  <div className="tweet-user-group">
                    <span className="tweet-user-name-group">
                      <strong className="tweet-user-name">
                        {tweet.user.name}
                      </strong>
                    </span>
                    <span className="tweet-user-username-group">
                      @<b>{tweet.user.username}</b>
                    </span>
                    <span className="tweet-user-created-group">
                      <Moment format="MMMM YYYY" withTitle>
                        {tweet.created}
                      </Moment>
                    </span>
                  </div>
                  <div className="tweet-content-group">
                    <p className="tweet-text">{tweet.text}</p>
                  </div>
                  <div className="tweet-bottom-group">
                    <span className="tweet-comments-info">
                      <i className="far fa-comment" /> {tweet.comments.length}
                    </span>
                    <span className="tweet-retweets-info">
                      <i className="fas fa-retweet" /> {tweet.retweets.length}
                    </span>
                    <span className="tweet-likes-info">
                      <i className="far fa-heart" /> {tweet.likes.length}
                    </span>
                  </div>
                </div>
              </li>
            ))
          ) : (
            <p className="no-tweets-info">None</p>
          )}
        </ul>
      </div>
    </div>
  </div>
);

TweetsBoard.propTypes = {
  tweets: PropTypes.array.isRequired
};

export default TweetsBoard;
