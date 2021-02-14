import React from 'react';

export function useForm(initialValues?: Record<string, any>) {
  const [values, setValues] = React.useState(initialValues || {});

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues(v => ({ ...v, [e.target.name]: e.target.value }));
  };

  return {
    values,
    onChange,
  };
}
