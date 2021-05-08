import React from 'react';
import { useParams } from 'react-router-dom';
import TweetsBoard from 'components/TweetsBoard';
import { ProfileTweetsBoard } from './style';
import { useTweets } from 'utils/tweets';
import DisplayError from 'components/DisplayError';

function Likes() {
  const { userId } = useParams();
  const {
    data,
    error,
    status,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useTweets({ likes: userId });

  if (error) {
    return <DisplayError error={error} />;
  }

  return (
    <ProfileTweetsBoard>
      <TweetsBoard
        queryKey={['tweets', { likes: userId }]}
        loading={status === 'loading'}
        pages={data?.pages || []}
        headerText="Likes"
        isFetching={isFetching}
        isFetchingNextPage={isFetchingNextPage}
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
      />
    </ProfileTweetsBoard>
  );
}

export default Likes;
