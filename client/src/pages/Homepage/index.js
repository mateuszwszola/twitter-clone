import React from 'react';
import { useQuery } from 'react-query';
import { getProfile } from 'api/profile';
import { getFeedTweets } from 'api/tweet';
import { DisplayError } from 'shared/components';
import { useUser } from 'context/UserContext';
import Loading from 'components/Loading';
import TweetsBoard from 'components/layout/TweetsBoard';
import UserPreview from 'components/layout/UserPreview';
import { Container, LeftSidebar, Main } from './style';

function Homepage() {
  const user = useUser();
  const {
    isLoading: isLoadingProfile,
    error: profileError,
    data: profileData,
  } = useQuery(['profiles', user._id], () => getProfile(user._id));
  const {
    isLoading: isLoadingTweets,
    error: tweetsError,
    data: tweets,
  } = useQuery(['tweets', 'feed'], getFeedTweets);

  return (
    <Container>
      <LeftSidebar>
        {profileError ? (
          <DisplayError>
            An error has occurred: {profileError.response.data.message}
          </DisplayError>
        ) : isLoadingProfile ? (
          <Loading />
        ) : (
          <UserPreview profile={profileData.profile} />
        )}
      </LeftSidebar>
      <Main>
        {tweetsError ? (
          <DisplayError>
            An error has occurred: {tweetsError.response.data.message}
          </DisplayError>
        ) : (
          <TweetsBoard
            loading={isLoadingTweets}
            tweets={tweets?.results || []}
          />
        )}
      </Main>
    </Container>
  );
}

export default Homepage;
