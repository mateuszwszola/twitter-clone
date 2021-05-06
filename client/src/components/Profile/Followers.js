import { ProfilesList } from 'components/Profiles';
import React, { useRef } from 'react';
import { useParams } from 'react-router';
import { useProfiles } from 'utils/profiles';
import DisplayError from 'components/DisplayError';
import Loading from 'components/Loading';
import ProfileCard from 'components/ProfileCard';
import { Button, InfoText } from 'shared/components';
import useIntersectionObserver from 'hooks/useIntersectionObserver';
import 'styled-components/macro';

function Followers() {
  const { userId } = useParams();
  const {
    isLoading,
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
  } = useProfiles({ following: userId });
  const loadMoreRef = useRef();

  useIntersectionObserver({
    target: loadMoreRef,
    onIntersect: fetchNextPage,
    enabled: hasNextPage,
  });

  if (error) {
    return <DisplayError error={error} />;
  }

  if (isLoading) {
    return <Loading />;
  }

  const numberOfProfiles =
    data?.pages.reduce((acc, el) => acc + el.results.length, 0) ?? 0;

  return (
    <div
      css={`
        margin-top: 15px;
      `}
    >
      {numberOfProfiles > 0 ? (
        <>
          <ProfilesList>
            {data.pages.map((page, i) => (
              <React.Fragment key={i}>
                {page.results.map((profile) => (
                  <ProfileCard key={profile._id} profile={profile} />
                ))}
              </React.Fragment>
            ))}
          </ProfilesList>
          <div
            css={`
              margin-top: 15px;
              display: flex;
              justify-content: center;
            `}
          >
            <Button
              ref={loadMoreRef}
              onClick={() => fetchNextPage()}
              disabled={!hasNextPage || isFetchingNextPage}
            >
              {isFetchingNextPage
                ? 'Loading more...'
                : hasNextPage
                ? 'Load More'
                : 'No more profiles to load'}
            </Button>
          </div>
          <InfoText>
            {isFetching && !isFetchingNextPage ? 'Fetching...' : null}
          </InfoText>
        </>
      ) : (
        <InfoText>There are no profiles to display</InfoText>
      )}
    </div>
  );
}

export default Followers;
