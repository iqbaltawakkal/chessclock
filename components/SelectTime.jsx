import React from "react";
import PropTypes from "prop-types";

const SelectTime = ({ name, placeholder, onChange, className, value, max }) => {
  return (
    <select
      id={name}
      name={name}
      placeholder={placeholder}
      onChange={onChange}
      value={value}
      className={`appearance-none bg-gray-200 dark:bg-gray-500 px-4 rounded-md ${className}`}
    >
      {[...Array(max)].map((value, index) => {
        return (
          <option key={index} value={index}>
            {index < 10 && "0"}
            {index}
          </option>
        );
      })}
    </select>
  );
};

SelectTime.defaultProps = {
  type: "text",
  className: "",
};

SelectTime.propTypes = {
  name: PropTypes.string,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  value: PropTypes.any,
  onChange: PropTypes.func,
  label: PropTypes.string,
  max: PropTypes.number,
};

export default SelectTime;
