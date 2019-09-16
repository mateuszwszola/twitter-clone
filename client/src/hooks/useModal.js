import { useEffect, useRef } from 'react';
import { withRouter } from 'react-router-dom';

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

function useModal({ location, history }) {
  let previousLocation = usePrevious(location);

  useEffect(() => {
    if (
      history.action !== 'POP' &&
      (!location.state || !location.state.modal)
    ) {
      previousLocation = location;
    }
  });

  let isModal = !!(
    location.state &&
    location.state.modal &&
    previousLocation !== location
  );

  return {
    isModal,
    previousLocation,
    location
  };
}

export default withRouter(useModal);
