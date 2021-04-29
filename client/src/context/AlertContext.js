import React, {
  useReducer,
  createContext,
  useCallback,
  useContext,
} from 'react';

const SET_ALERT = 'SET_ALERT';
const REMOVE_ALERT = 'REMOVE_ALERT';

function reducer(state, action) {
  const { type, payload } = action;

  switch (type) {
    case SET_ALERT:
      return [payload.alert, ...state];
    case REMOVE_ALERT:
      return state.filter((alert) => alert.id !== payload.id);
    default:
      return state;
  }
}

const AlertContext = createContext();

function AlertProvider(props) {
  const [state, dispatch] = useReducer(reducer, []);

  const setAlert = useCallback(
    ({ type, msg, time = 3000 }) => {
      const alert = { id: Date.now(), type, msg };

      dispatch({
        type: SET_ALERT,
        payload: { alert },
      });

      setTimeout(
        () => dispatch({ type: REMOVE_ALERT, payload: { id: alert.id } }),
        time
      );
    },
    [dispatch]
  );

  const removeAlert = useCallback(
    (id) => {
      dispatch({
        type: REMOVE_ALERT,
        payload: { id },
      });
    },
    [dispatch]
  );

  const value = React.useMemo(
    () => ({ alerts: state, setAlert, removeAlert }),
    [state, setAlert, removeAlert]
  );

  return <AlertContext.Provider value={value} {...props} />;
}

function useAlert() {
  const context = useContext(AlertContext);
  if (context === undefined) {
    throw new Error('useAlert must be used withing a AlertProvider');
  }
  return context;
}

export { AlertProvider, useAlert };
