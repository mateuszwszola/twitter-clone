import React from 'react';
import { useParams } from 'react-router-dom';
import TweetsBoard from 'components/TweetsBoard';
import { ProfileTweetsBoard } from './style';
import { useTweets } from 'utils/tweets';
import DisplayError from 'components/DisplayError';

function Likes() {
  const { userId } = useParams();
  const { isLoading, error, data } = useTweets({ likes: userId });

  if (error) {
    return <DisplayError error={error} />;
  }

  return (
    <ProfileTweetsBoard>
      <TweetsBoard loading={isLoading} tweets={data?.results || []} />
    </ProfileTweetsBoard>
  );
}

export default Likes;
