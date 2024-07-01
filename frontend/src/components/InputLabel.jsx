import React from 'react';
import { twMerge } from 'tailwind-merge';

const InputLabel = ({ htmlFor, text, className = '', ...props }) => {
  const labelClassName = twMerge(
    'mb-2 text-sm font-medium text-gray-900 w-fit',
    className
  );

  return (
    <label htmlFor={htmlFor} className={labelClassName} {...props}>
      {text}
    </label>
  );
};

export default InputLabel;
