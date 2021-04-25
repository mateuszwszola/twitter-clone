import React from 'react';
import { useParams } from 'react-router-dom';
import TweetsBoard from 'components/TweetsBoard';
import { DisplayError } from 'shared/components';
import { ProfileTweetsBoard } from './style';
import { useTweets } from 'utils/tweets';

function ProfileTweets() {
  const { userId } = useParams();
  const { data, isLoading, error } = useTweets({ author: userId });

  if (error) {
    return <DisplayError error={error} />;
  }

  return (
    <ProfileTweetsBoard>
      <TweetsBoard loading={isLoading} tweets={data?.results || []} />
    </ProfileTweetsBoard>
  );
}

export default ProfileTweets;
