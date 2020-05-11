import { useState, useEffect } from "react";

export const useFormCheck = initialValue => {
    const [selected, setSelected] = useState('');

    useEffect(() => {
        setSelected(initialValue);
    }, [initialValue, setSelected])

    const handleChange = e => {
        setSelected(e.target.value);
    };

    return {
        selected,
        onChange: handleChange
    }
}