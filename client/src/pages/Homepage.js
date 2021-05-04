import React from 'react';
import DisplayError from 'components/DisplayError';
import TweetsBoard from 'components/TweetsBoard';
import { Container } from 'shared/layout';
import 'styled-components/macro';
import { useTweets } from 'utils/tweets';

function Homepage() {
  const {
    data,
    error,
    status,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useTweets();

  return (
    <Container>
      {error ? (
        <DisplayError error={error} />
      ) : (
        <>
          <TweetsBoard
            loading={status === 'loading'}
            pages={data?.pages || []}
            isFetching={isFetching}
            isFetchingNextPage={isFetchingNextPage}
            hasNextPage={hasNextPage}
            fetchNextPage={fetchNextPage}
          />
        </>
      )}
    </Container>
  );
}

export default Homepage;
