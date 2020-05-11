import { useState, useEffect } from "react";

export const useFormInput = initialValue => {
    const [value, setValue] = useState('');

    useEffect(() => {
        setValue(initialValue);
    }, [initialValue, setValue])

    const handleChange = e => {
        setValue(e.target.value);
    };

    return {
        value: value,
        onChange: handleChange
    }
}