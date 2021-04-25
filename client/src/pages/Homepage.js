import React from 'react';
import TweetsBoard from 'components/TweetsBoard';
import DisplayError from 'components/DisplayError';
import { Container } from 'shared/layout';
import { useFeedTweets } from 'utils/tweets';

function Homepage() {
  const { isLoading, error, data } = useFeedTweets();

  return (
    <Container>
      {error ? (
        <DisplayError error={error} />
      ) : (
        <TweetsBoard loading={isLoading} tweets={data?.results || []} />
      )}
    </Container>
  );
}

export default Homepage;
