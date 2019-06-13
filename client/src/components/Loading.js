import React, { useState, useEffect } from 'react';

const defaultText = 'Loading';

function Loading() {
  const [text, setText] = useState(defaultText);

  useEffect(() => {
    const interval = setInterval(() => {
      if (text === defaultText + '...') {
        setText(defaultText);
      } else {
        setText(text + '.');
      }
    }, 1000);

    return () => clearInterval(interval);
  });

  return <div>{text}</div>;
}

export default Loading;
