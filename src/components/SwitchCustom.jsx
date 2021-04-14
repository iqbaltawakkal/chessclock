import React from "react";
import { Switch } from "@headlessui/react";
import PropTypes from "prop-types";

const SwitchCustom = (props) => {
  return (
    <div className="flex items-center justify-center p-12">
      <Switch.Group as="div" className="flex items-center space-x-4">
        <Switch.Label>{props.label}</Switch.Label>
        <Switch
          as="button"
          checked={props.value}
          onChange={props.onChange}
          className={`${
            props.value ? "bg-blue-600" : "bg-gray-200"
          } relative inline-flex flex-shrink-0 h-6 w-12 transition-colors duration-200 ease-in-out border-2 border-transparent rounded-full cursor-pointer focus:outline-none focus-shadow-outline`}
        >
          {({ checked }) => (
            <span
              className={`${
                checked ? "translate-x-6" : "translate-x-0"
              } inline-block w-5 h-5 transition duration-200 ease-in-out transform bg-white rounded-full`}
            />
          )}
        </Switch>
      </Switch.Group>
    </div>
  );
};

SwitchCustom.propTypes = {
  label: PropTypes.string,
  value: PropTypes.bool.isRequired,
  onChange: PropTypes.func,
};

export default SwitchCustom;
