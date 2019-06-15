import React, { useState } from 'react';
import useInterval from './useInterval';

const defaultText = 'Loading';

function Loading() {
  const [text, setText] = useState(defaultText);

  useInterval(() => {
    if (text === defaultText + '...') {
      setText(defaultText);
    } else {
      setText(text + '.');
    }
  }, 1000);

  return <div>{text}</div>;
}

export default Loading;
