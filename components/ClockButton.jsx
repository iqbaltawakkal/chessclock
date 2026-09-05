import React, { memo, useCallback } from "react";
import Time from "./Time";

const ClockButton = memo(function ClockButton({
  playerNumber,
  isTop,
  time,
  isActive,
  isFlagged,
  disabled,
  flipTimer,
  onPress,
}) {
  const handlePointerDown = useCallback(
    (e) => {
      // Allow only primary pointer (left mouse button or first touch contact)
      if (e.button !== undefined && e.button !== 0) return;
      if (disabled) return;

      // Prevent mouse emulation and synthetic event delays on mobile
      if (e.cancelable) {
        e.preventDefault();
      }

      onPress();
    },
    [disabled, onPress],
  );

  let bgClass = "bg-white dark:bg-[#0D1117] text-gray-800 dark:text-gray-100";
  let borderClass = "border border-gray-200 dark:border-[#30363d]";

  if (isFlagged) {
    bgClass = "bg-red-500 text-white dark:bg-red-600";
    borderClass = "border-red-600 dark:border-red-700";
  } else if (isActive) {
    bgClass =
      "bg-emerald-50 text-emerald-950 dark:bg-[#0b1d16] dark:text-emerald-100";
    borderClass =
      "border-2 border-emerald-500 dark:border-emerald-400 ring-2 ring-emerald-400/20";
  }

  return (
    <button
      type="button"
      role="button"
      aria-label={`Player ${playerNumber} clock`}
      disabled={disabled}
      onPointerDown={handlePointerDown}
      className={`
        relative w-full h-full block rounded-2xl shadow-lg transition-transform duration-75
        select-none overflow-hidden outline-none focus:outline-none
        cursor-pointer
        ${bgClass} ${borderClass}
        ${
          !disabled
            ? "active:scale-[0.985] active:brightness-95 hover:shadow-xl"
            : "opacity-90"
        }
      `}
      style={{
        touchAction: "manipulation",
        WebkitUserSelect: "none",
        WebkitTapHighlightColor: "transparent",
      }}
    >
      {isFlagged && (
        <div className="absolute top-3 right-4 text-xs font-bold uppercase tracking-wider text-white bg-red-700/80 px-2 py-0.5 rounded pointer-events-none animate-pulse">
          Time Up!
        </div>
      )}

      {/* Clock Face */}
      <Time time={time} flipTimer={flipTimer} isTop={isTop} />
    </button>
  );
});

export default ClockButton;
