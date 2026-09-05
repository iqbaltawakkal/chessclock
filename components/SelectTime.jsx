import React from "react";

const SelectTime = ({
  name,
  onChange,
  className = "",
  value = 0,
  max = 60,
  ariaLabel = "Select time",
}) => {
  return (
    <select
      id={name}
      name={name}
      aria-label={ariaLabel}
      onChange={onChange}
      value={value}
      className={`bg-gray-100 dark:bg-[#161b22] text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-[#30363d] px-3 py-1.5 rounded-lg text-base font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-colors cursor-pointer ${className}`}
    >
      {[...Array(max)].map((_, index) => {
        return (
          <option key={index} value={index}>
            {index < 10 ? `0${index}` : index}
          </option>
        );
      })}
    </select>
  );
};

export default SelectTime;
