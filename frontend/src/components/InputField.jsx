import React from "react";
import { twMerge } from "tailwind-merge";

const InputField = ({
  id,
  type = "text",
  name,
  value = "",
  onChange,
  rows = 1,
  cols = 20,
  className = "",
  min = "0",
  ...props
}) => {
  const inputClassName = twMerge(
    "bg-gray-100 border-b-2 border-gray-300 text-gray-600 text-sm rounded-0 outline-0 focus:border-b-slate-500 p-1.5",
    type === "textarea" ? "border-2 rounded-lg bg-gray-50" : "",
    className
  );

  if (type === "textarea") {
    return (
      <textarea
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        rows={rows}
        cols={cols}
        className={inputClassName}
        {...props}
      />
    );
  }

  return (
    <input
      type={type}
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      className={inputClassName}
      min={type === "number" ? "0" : undefined}
      {...props}
      autoComplete="off"
    />

  );
};

export default InputField;
