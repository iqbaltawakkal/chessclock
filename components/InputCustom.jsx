import React from "react";
import PropTypes from "prop-types";

const InputCustom = ({
  name,
  type,
  placeholder,
  onChange,
  className,
  value,
  label,
}) => {
  return (
    <>
      <label htmlFor={name}>{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        onChange={onChange}
        value={value}
        className={className}
      />
    </>
  );
};

InputCustom.defaultProps = {
  type: "text",
  className: "",
};

InputCustom.propTypes = {
  name: PropTypes.string,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  value: PropTypes.any,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string,
};

export default InputCustom;
