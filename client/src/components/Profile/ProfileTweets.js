import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import client from 'api/client';
import TweetsBoard from 'components/layout/TweetsBoard';
import { DisplayError } from 'shared/components';
import { ProfileTweetsBoard } from './style';

function ProfileTweets() {
  const { userId } = useParams();
  const { data: tweets, isLoading, error } = useQuery(['tweets', userId], () =>
    client.get(`/tweets?author=${userId}`).then((res) => res.data.results)
  );

  if (error) {
    return (
      <DisplayError>
        An error occurred: {error.response.data.message}
      </DisplayError>
    );
  }

  return (
    <ProfileTweetsBoard>
      <TweetsBoard loading={isLoading} tweets={tweets || []} />
    </ProfileTweetsBoard>
  );
}

export default ProfileTweets;
