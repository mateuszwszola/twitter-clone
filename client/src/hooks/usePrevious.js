import { useEffect, useRef } from 'react';

function usePrevious(value) {
    const ref = useRef(value);
    useEffect(() => {
        ref.current = value;
    }, [value]);
    return ref.current;
}

export default usePrevious;