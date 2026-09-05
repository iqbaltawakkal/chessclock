import React, { memo } from "react";

function formatTime(ms) {
  if (ms <= 0) return { main: "0:00", tenths: "" };

  const totalSeconds = ms / 1000;
  const minutes = Math.floor(totalSeconds / 60);
  const remainingSeconds = Math.floor(totalSeconds % 60);
  const tenths = Math.floor((ms % 1000) / 100);

  if (ms >= 60000) {
    const secStr = remainingSeconds < 10 ? `0${remainingSeconds}` : `${remainingSeconds}`;
    return {
      main: `${minutes}:${secStr}`,
      tenths: "",
    };
  }

  // Under 1 minute: show tenths of a second for precision
  const secStr = remainingSeconds < 10 ? `0${remainingSeconds}` : `${remainingSeconds}`;
  return {
    main: `${secStr}.${tenths}`,
    tenths: "",
  };
}

const Time = memo(function Time({ time, flipTimer, isTop = false }) {
  const { main } = formatTime(time);

  // Rotation logic:
  // If flipTimer is enabled, rotate for head-to-head (top rotated 180°, bottom 0°)
  // Otherwise, default to 90° sideways view as originally designed
  let rotationClass = flipTimer ? "-rotate-90" : "rotate-90";
  if (flipTimer && isTop) {
    rotationClass = "rotate-180";
  } else if (flipTimer && !isTop) {
    rotationClass = "rotate-0";
  }

  return (
    <div className="w-full h-full flex items-center justify-center select-none pointer-events-none">
      <svg
        className={`font-digital fill-current w-full h-full max-h-[85%] transition-transform duration-200 transform ${rotationClass}`}
        viewBox="0 0 100 50"
      >
        <text
          x="50%"
          y="56%"
          dominantBaseline="middle"
          textAnchor="middle"
          fontSize="36"
          fontWeight="bold"
          letterSpacing="1px"
        >
          {main}
        </text>
      </svg>
    </div>
  );
});

export default Time;
