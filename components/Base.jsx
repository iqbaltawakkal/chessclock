import React, { useContext, useEffect, useState } from "react";
import { MdPlayArrow, MdReplay, MdSettings, MdPause } from "react-icons/md";
import Time from "./Time";
import { AppContext } from "../pages/index";
import { useAudio } from "react-use";

let intervalTop, intervalBottom;

const Base = () => {
  const intervalTime = 100;
  const context = useContext(AppContext);
  const [timerTop, setTimerTop] = useState(context.state.timerTop);
  const [timerBottom, setTimerBottom] = useState(context.state.timerTop);
  const increment = context.state.increment;

  const [isPaused, setIsPaused] = useState(false);
  const [status, setStatus] = useState("");

  // eslint-disable-next-line no-unused-vars
  const [audio, state, controls] = useAudio({
    src: "https://freesound.org/data/previews/414/414763_3094998-lq.mp3",
    autoPlay: false,
  });

  const timerTopAction = () => {
    state.time + 0.2;
    controls.play();
    setStatus("bottom");
    clearInterval(intervalBottom);
    setTimerBottom((timerBottom) => timerBottom + increment);
    intervalTop = setInterval(() => {
      setTimerTop((timerTop) => timerTop - intervalTime);
    }, intervalTime);
  };

  const timerBottomAction = () => {
    state.time + 0.2;
    controls.play();
    setStatus("top");
    clearInterval(intervalTop);
    setTimerTop((timerTop) => timerTop + increment);
    intervalBottom = setInterval(() => {
      setTimerBottom((timerBottom) => timerBottom - intervalTime);
    }, intervalTime);
  };

  const restartAction = () => {
    clearInterval(intervalTop);
    clearInterval(intervalBottom);
    setTimerTop(context.state.timerTop);
    setTimerBottom(context.state.timerTop);
    setIsPaused(false);
    setStatus("");
  };

  const settingAction = () => {
    context.dispatch({ type: "isModalActive", payload: true });
    if (status) {
      setIsPaused(true);
    }
  };

  useEffect(() => {
    if (isPaused) {
      clearInterval(intervalTop);
      clearInterval(intervalBottom);
    } else {
      if (status == "top") {
        intervalBottom = setInterval(() => {
          setTimerBottom((timerBottom) => timerBottom - intervalTime);
        }, intervalTime);
      } else if (status == "bottom") {
        intervalTop = setInterval(() => {
          setTimerTop((timerTop) => timerTop - intervalTime);
        }, intervalTime);
      }
    }
  }, [isPaused]);

  useEffect(() => {
    if (timerTop <= 0 || timerBottom <= 0) {
      clearInterval(intervalTop);
      clearInterval(intervalBottom);
      setStatus("end");
      window.navigator.vibrate(1000);
    }
  }, [timerTop, timerBottom]);

  return (
    <div className="flex flex-col min-h-screen max-w-lg mx-auto py-4 px-4 space-y-4">
      {audio}
      <div className="flex-grow relative">
        <button
          disabled={["top", "end"].includes(status) || isPaused}
          className={`block bg-white dark:bg-[#0D1117] border border-gray-200 dark:border-[#30363d] text-center w-full shadow-xl rounded-lg outline-none focus:outline-none focus:shadow-sm absolute top-0 bottom-0 overflow-hidden  ${
            timerTop <= 0 && "bg-red-400"
          }`}
          onClick={() => timerBottomAction()}
        >
          <Time flipTimer={context.state.flipTimer} time={timerTop}></Time>
        </button>
      </div>
      <div className="bg-white dark:bg-[#0D1117] flex-grow-0 flex justify-around text-2xl border border-gray-200 dark:border-[#30363d] rounded-lg px-4 text-center text-gray-400">
        <button
          disabled={!status || status == "end"}
          onClick={() => setIsPaused(!isPaused)}
          className="p-4 focus:outline-none"
        >
          {isPaused ? (
            <span className="flex">
              <span className="animate-ping absolute inline-flex">
                <MdPlayArrow></MdPlayArrow>
              </span>
              <span className="relative inline-flex">
                <MdPlayArrow></MdPlayArrow>
              </span>
            </span>
          ) : (
            <MdPause></MdPause>
          )}
        </button>
        <button
          onClick={() => settingAction()}
          className="p-4 focus:outline-none"
        >
          <MdSettings></MdSettings>
        </button>
        <button
          onClick={() => restartAction()}
          className="p-4 focus:outline-none"
        >
          <MdReplay></MdReplay>
        </button>
      </div>
      <div className="flex-grow relative">
        <button
          disabled={["end", "bottom"].includes(status) || isPaused}
          className={`block bg-white dark:bg-[#0D1117] border border-gray-200 dark:border-[#30363d] text-center w-full shadow-xl rounded-lg outline-none focus:outline-none focus:shadow-sm absolute top-0 bottom-0 overflow-hidden ${
            timerBottom <= 0 && "bg-red-400"
          }`}
          onClick={() => timerTopAction()}
        >
          <Time flipTimer={context.state.flipTimer} time={timerBottom}></Time>
        </button>
      </div>
    </div>
  );
};

export default Base;
