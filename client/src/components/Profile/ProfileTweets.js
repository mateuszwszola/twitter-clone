import React from 'react';
import { useParams } from 'react-router-dom';
import TweetsBoard from 'components/TweetsBoard';
import { DisplayError } from 'shared/components';
import { ProfileTweetsBoard } from './style';
import { useTweets } from 'utils/tweets';

function ProfileTweets() {
  const { userId } = useParams();
  const {
    data,
    status,
    error,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useTweets({ author: userId });

  if (error) {
    return <DisplayError error={error} />;
  }

  return (
    <ProfileTweetsBoard>
      <TweetsBoard
        queryKey={['tweets', { author: userId }]}
        loading={status === 'loading'}
        pages={data?.pages || []}
        isFetching={isFetching}
        isFetchingNextPage={isFetchingNextPage}
        hasNextPage={hasNextPage}
        fetchNextPage={fetchNextPage}
      />
    </ProfileTweetsBoard>
  );
}

export default ProfileTweets;
