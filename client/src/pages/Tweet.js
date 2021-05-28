import DisplayTweet from 'components/Tweet';
import { useParams } from 'react-router-dom';
import { Container } from 'shared/layout';

function TweetPage() {
  const { tweetId } = useParams();

  return (
    <Container>
      <div>
        <DisplayTweet tweetId={tweetId} />
      </div>
    </Container>
  );
}

export default TweetPage;
