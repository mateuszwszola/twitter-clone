import React from 'react';
import spinner from 'img/spinner.gif';

const styles = {
  width: '200px',
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
};


export default () => (
    <>
      <img
          style={styles}
          src={spinner}
          alt="Loading..."
      />
    </>
);
