import React, { useContext, useEffect, useRef, useState, useCallback } from "react";
import { MdPlayArrow, MdReplay, MdSettings, MdPause } from "react-icons/md";
import ClockButton from "./ClockButton";
import { AppContext } from "../pages/index";
import { playClickSound, playFlagSound } from "../lib/sound";

const Base = () => {
  const { state: contextState, dispatch } = useContext(AppContext);
  const initialTop = contextState.timerTop;
  const initialBottom = contextState.timerBottom;
  const increment = contextState.increment || 0;
  const flipTimer = contextState.flipTimer;

  // Authoritative remaining times (in ms)
  const [timerTop, setTimerTop] = useState(initialTop);
  const [timerBottom, setTimerBottom] = useState(initialBottom);

  // Active player turn: null (not started), "top", "bottom", "end"
  const [activeTurn, setActiveTurn] = useState(null);
  const [isPaused, setIsPaused] = useState(false);

  // Refs for zero-drift timestamp calculation
  const turnStartTimeRef = useRef(0);
  const baseTimeTopRef = useRef(initialTop);
  const baseTimeBottomRef = useRef(initialBottom);
  const activeTurnRef = useRef(null);
  const isPausedRef = useRef(false);
  const animFrameIdRef = useRef(null);

  // Keep refs in sync with state
  useEffect(() => {
    activeTurnRef.current = activeTurn;
  }, [activeTurn]);

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  // Sync when initial times change from settings
  useEffect(() => {
    setTimerTop(initialTop);
    setTimerBottom(initialBottom);
    baseTimeTopRef.current = initialTop;
    baseTimeBottomRef.current = initialBottom;
    setActiveTurn(null);
    setIsPaused(false);
  }, [initialTop, initialBottom]);

  // Vibrate helper
  const triggerHaptic = (duration = 20) => {
    if (typeof window !== "undefined" && window.navigator && window.navigator.vibrate) {
      try {
        window.navigator.vibrate(duration);
      } catch {
        // Ignore if restricted
      }
    }
  };

  // Switch turn to bottom (Player 1 ended their turn)
  const handleTopPress = useCallback(() => {
    if (activeTurnRef.current === "bottom" || activeTurnRef.current === "end" || isPausedRef.current) {
      return;
    }

    playClickSound();
    triggerHaptic(20);

    const now = performance.now();

    if (activeTurnRef.current === "top") {
      const elapsed = now - turnStartTimeRef.current;
      const currentRemaining = Math.max(0, baseTimeTopRef.current - elapsed);
      const newTop = currentRemaining + increment;
      baseTimeTopRef.current = newTop;
      setTimerTop(newTop);
    }

    // Now start bottom player's turn
    turnStartTimeRef.current = now;
    setActiveTurn("bottom");
  }, [increment]);

  // Switch turn to top (Player 2 ended their turn)
  const handleBottomPress = useCallback(() => {
    if (activeTurnRef.current === "top" || activeTurnRef.current === "end" || isPausedRef.current) {
      return;
    }

    playClickSound();
    triggerHaptic(20);

    const now = performance.now();

    if (activeTurnRef.current === "bottom") {
      const elapsed = now - turnStartTimeRef.current;
      const currentRemaining = Math.max(0, baseTimeBottomRef.current - elapsed);
      const newBottom = currentRemaining + increment;
      baseTimeBottomRef.current = newBottom;
      setTimerBottom(newBottom);
    }

    // Now start top player's turn
    turnStartTimeRef.current = now;
    setActiveTurn("top");
  }, [increment]);

  const restartAction = useCallback(() => {
    if (animFrameIdRef.current) {
      cancelAnimationFrame(animFrameIdRef.current);
      animFrameIdRef.current = null;
    }
    setActiveTurn(null);
    setIsPaused(false);
    setTimerTop(initialTop);
    setTimerBottom(initialBottom);
    baseTimeTopRef.current = initialTop;
    baseTimeBottomRef.current = initialBottom;
  }, [initialTop, initialBottom]);

  const togglePauseAction = useCallback(() => {
    if (!activeTurnRef.current || activeTurnRef.current === "end") return;

    if (!isPausedRef.current) {
      // Pausing: capture exact remaining time
      const now = performance.now();
      const elapsed = now - turnStartTimeRef.current;

      if (activeTurnRef.current === "top") {
        const remaining = Math.max(0, baseTimeTopRef.current - elapsed);
        baseTimeTopRef.current = remaining;
        setTimerTop(remaining);
      } else if (activeTurnRef.current === "bottom") {
        const remaining = Math.max(0, baseTimeBottomRef.current - elapsed);
        baseTimeBottomRef.current = remaining;
        setTimerBottom(remaining);
      }
      setIsPaused(true);
    } else {
      // Resuming: reset start timestamp
      turnStartTimeRef.current = performance.now();
      setIsPaused(false);
    }
  }, []);

  const settingAction = useCallback(() => {
    if (activeTurnRef.current && activeTurnRef.current !== "end" && !isPausedRef.current) {
      togglePauseAction();
    }
    dispatch({ type: "isModalActive", payload: true });
  }, [dispatch, togglePauseAction]);

  // High-precision clock tick loop using requestAnimationFrame + delta timestamps
  useEffect(() => {
    if (!activeTurn || activeTurn === "end" || isPaused) {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
        animFrameIdRef.current = null;
      }
      return;
    }

    let lastUpdate = 0;
    const updateIntervalMs = 50; // smooth 20fps display updates

    const tick = (currentTime) => {
      if (currentTime - lastUpdate >= updateIntervalMs) {
        lastUpdate = currentTime;
        const now = performance.now();
        const elapsed = now - turnStartTimeRef.current;

        if (activeTurn === "top") {
          const remaining = Math.max(0, baseTimeTopRef.current - elapsed);
          setTimerTop(remaining);

          if (remaining <= 0) {
            setActiveTurn("end");
            playFlagSound();
            triggerHaptic([200, 100, 200]);
            return;
          }
        } else if (activeTurn === "bottom") {
          const remaining = Math.max(0, baseTimeBottomRef.current - elapsed);
          setTimerBottom(remaining);

          if (remaining <= 0) {
            setActiveTurn("end");
            playFlagSound();
            triggerHaptic([200, 100, 200]);
            return;
          }
        }
      }

      animFrameIdRef.current = requestAnimationFrame(tick);
    };

    animFrameIdRef.current = requestAnimationFrame(tick);

    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
        animFrameIdRef.current = null;
      }
    };
  }, [activeTurn, isPaused]);

  // Desktop keyboard shortcuts (Spacebar to switch turn, P to pause, R to restart)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore if user is inside an input/select
      if (["INPUT", "SELECT", "TEXTAREA"].includes(e.target?.tagName)) return;

      if (e.code === "Space") {
        e.preventDefault();
        if (!activeTurn || activeTurn === "top") {
          handleTopPress();
        } else if (activeTurn === "bottom") {
          handleBottomPress();
        }
      } else if (e.code === "KeyP") {
        e.preventDefault();
        togglePauseAction();
      } else if (e.code === "KeyR") {
        e.preventDefault();
        restartAction();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeTurn, handleTopPress, handleBottomPress, togglePauseAction, restartAction]);

  const isTopDisabled = activeTurn === "bottom" || activeTurn === "end" || isPaused;
  const isBottomDisabled = activeTurn === "top" || activeTurn === "end" || isPaused;

  return (
    <div className="flex flex-col h-screen max-w-lg mx-auto py-3 px-3 sm:py-4 sm:px-4 space-y-3">
      {/* Player 1 Clock (Top) */}
      <div className="flex-1 min-h-0 relative">
        <ClockButton
          playerNumber={1}
          isTop={true}
          time={timerTop}
          isActive={activeTurn === "top"}
          isFlagged={activeTurn === "end" && timerTop <= 0}
          disabled={isTopDisabled}
          flipTimer={flipTimer}
          onPress={handleTopPress}
        />
      </div>

      {/* Middle Toolbar Controls */}
      <div className="flex-none bg-white dark:bg-[#0D1117] flex justify-around items-center text-2xl border border-gray-200 dark:border-[#30363d] rounded-2xl py-1.5 px-4 shadow-sm text-gray-500 dark:text-gray-400">
        <button
          type="button"
          aria-label={isPaused ? "Resume game" : "Pause game"}
          disabled={!activeTurn || activeTurn === "end"}
          onClick={togglePauseAction}
          className="p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors focus:outline-none"
        >
          {isPaused ? (
            <span className="relative flex items-center justify-center">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <MdPlayArrow className="relative text-emerald-500" />
            </span>
          ) : (
            <MdPause />
          )}
        </button>

        <button
          type="button"
          aria-label="Settings"
          onClick={settingAction}
          className="p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none"
        >
          <MdSettings />
        </button>

        <button
          type="button"
          aria-label="Restart game"
          onClick={restartAction}
          className="p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none"
        >
          <MdReplay />
        </button>
      </div>

      {/* Player 2 Clock (Bottom) */}
      <div className="flex-1 min-h-0 relative">
        <ClockButton
          playerNumber={2}
          isTop={false}
          time={timerBottom}
          isActive={activeTurn === "bottom"}
          isFlagged={activeTurn === "end" && timerBottom <= 0}
          disabled={isBottomDisabled}
          flipTimer={flipTimer}
          onPress={handleBottomPress}
        />
      </div>
    </div>
  );
};

export default Base;
