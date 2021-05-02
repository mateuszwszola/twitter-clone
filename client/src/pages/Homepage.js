import { useRef } from 'react';
import DisplayError from 'components/DisplayError';
import TweetsBoard from 'components/TweetsBoard';
import useIntersectionObserver from 'hooks/useIntersectionObserver';
import React from 'react';
import { Button, InfoText } from 'shared/components';
import { Container } from 'shared/layout';
import 'styled-components/macro';
import { useFeedTweets } from 'utils/tweets';

function Homepage() {
  const {
    data,
    error,
    status,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useFeedTweets();

  const loadMoreButtonRef = useRef();

  useIntersectionObserver({
    target: loadMoreButtonRef,
    onIntersect: fetchNextPage,
    enabled: hasNextPage,
  });

  return (
    <Container>
      {error ? (
        <DisplayError error={error} />
      ) : (
        <>
          <TweetsBoard
            loading={status === 'loading'}
            pages={data?.pages || []}
          />
          {status !== 'loading' && (
            <>
              <div
                css={`
                  margin-top: 15px;
                  display: flex;
                  justify-content: center;
                `}
              >
                <Button
                  ref={loadMoreButtonRef}
                  onClick={() => fetchNextPage()}
                  disabled={!hasNextPage || isFetchingNextPage}
                >
                  {isFetchingNextPage
                    ? 'Loading more...'
                    : hasNextPage
                    ? 'Load More'
                    : 'Nothing more to load'}
                </Button>
              </div>
              <InfoText>
                {isFetching && !isFetchingNextPage ? 'Fetching...' : null}
              </InfoText>
            </>
          )}
        </>
      )}
    </Container>
  );
}

export default Homepage;
