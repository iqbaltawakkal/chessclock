import React from "react";
import { Field, Label, Switch } from "@headlessui/react";

const SwitchCustom = ({ label, value, onChange, className = "" }) => {
  return (
    <Field className={`flex justify-between items-center py-2 ${className}`}>
      <Label className="text-gray-750 dark:text-gray-300 font-medium cursor-pointer">
        {label}
      </Label>
      <Switch
        checked={value}
        onChange={onChange}
        className={`${
          value ? "bg-emerald-600" : "bg-gray-300 dark:bg-gray-700"
        } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none`}
      >
        <span
          className={`${
            value ? "translate-x-5" : "translate-x-0"
          } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out`}
        />
      </Switch>
    </Field>
  );
};

export default SwitchCustom;
