import React, { useState } from 'react';
import useInterval from 'hooks/useInterval';

const defaultText = 'Loading';

const styles = {
  textAlign: 'center',
  margin: '15px 10px'
};

function Loading() {
  const [text, setText] = useState(defaultText);

  useInterval(() => {
    if (text === defaultText + '...') {
      setText(defaultText);
    } else {
      setText(text + '.');
    }
  }, 1000);

  return <div style={styles}>{text}</div>;
}

export default Loading;
