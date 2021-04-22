import React from "react";
import PropTypes from "prop-types";

const Time = (props) => {
  const getMinutes = (time) => {
    return Math.floor(time / 60000);
  };

  const getSeconds = (time) => {
    return time < 60000
      ? ((time - getMinutes(time) * 60000) / 1000).toFixed(1)
      : Math.floor((time - getMinutes(time) * 60000) / 1000);
  };
  return (
    <>
      <svg
        className={`font-digital text-gray-600 fill-current w-full h-full transform ${
          props.flipTimer ? `-rotate-90` : `rotate-90`
        }`}
        viewBox="0 0 50 50"
      >
        <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle">
          {props.time >= 60000 && getMinutes(props.time) + ":"}
          {getSeconds(props.time)}
        </text>
      </svg>
    </>
  );
};

Time.propTypes = {
  time: PropTypes.number.isRequired,
  flipTimer: PropTypes.bool,
};

export default Time;
