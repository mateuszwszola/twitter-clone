import { useState, useEffect } from 'react';

function useDynamicFormInput(initialValue) {
    const [value, setValue]= useState(initialValue);

    useEffect(() => {
        setValue(initialValue)
    }, [initialValue]);

    const handleChange = e => {
        setValue(e.target.value);
    };
    return { value, onChange: handleChange };
}

export default useDynamicFormInput;