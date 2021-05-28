import CreateTweetForm from 'components/CreateTweet';
import 'styled-components/macro';
import { useHistory } from 'react-router';
import { Container } from 'shared/layout';

function CreateTweetPage() {
  const history = useHistory();

  return (
    <Container>
      <div
        css={`
          width: 100%;
          max-width: 650px;
          margin: 0 auto;
        `}
      >
        <CreateTweetForm onCreate={() => history.push('/')} />
      </div>
    </Container>
  );
}

export default CreateTweetPage;
