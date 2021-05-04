import { useReducer, useEffect, useRef } from 'react';
import isEqual from 'lodash/isEqual';

function useForm(formValues = {}) {
  const prevFormValuesRef = useRef(formValues);
  const [state, setState] = useReducer((s, a) => ({ ...s, ...a }), formValues);

  useEffect(() => {
    if (!isEqual(formValues, prevFormValuesRef.current)) {
      setState(formValues);
    }
    prevFormValuesRef.current = formValues;
  }, [formValues]);

  const handleChange = (e) => {
    setState({
      [e.target.name]: e.target.value,
    });
  };

  return { values: state, handleChange };
}

export default useForm;
