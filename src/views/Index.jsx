import React, { useEffect, useState } from "react";
import { MdPlayArrow, MdReplay, MdSettings, MdPause } from "react-icons/md";

let intervalTop, intervalBottom;

const Home = () => {
  const intervalTime = 100;
  const increment = 0;
  const [isPaused, setIsPaused] = useState(false);
  const [isEnd, setIsEnd] = useState(false);
  const [onTicking, setOnTicking] = useState("");
  const [timerTop, setTimerTop] = useState(60000);
  const [timerBottom, setTimerBottom] = useState(2200);

  const timerTopAction = () => {
    setOnTicking("bottom");
    clearInterval(intervalBottom);
    setTimerBottom((timerBottom) => timerBottom + increment);
    intervalTop = setInterval(() => {
      setTimerTop((timerTop) => timerTop - intervalTime);
    }, intervalTime);
  };

  const timerBottomAction = () => {
    setOnTicking("top");
    clearInterval(intervalTop);
    setTimerTop((timerTop) => timerTop + increment);
    intervalBottom = setInterval(() => {
      setTimerBottom((timerBottom) => timerBottom - intervalTime);
    }, intervalTime);
  };

  const restart = () => {
    setTimerTop(60000);
    setTimerBottom(2200);
    setIsEnd(false);
  };

  const getMinutes = (time) => {
    return Math.floor(time / 60000);
  };

  const getSeconds = (time) => {
    return time < 60000
      ? (time - getMinutes(time) * 60000) / 1000
      : Math.floor((time - getMinutes(time) * 60000) / 1000);
  };

  useEffect(() => {
    if (isPaused) {
      clearInterval(intervalTop);
      clearInterval(intervalBottom);
    } else {
      if (onTicking == "top") {
        intervalBottom = setInterval(() => {
          setTimerBottom((timerBottom) => timerBottom - intervalTime);
        }, intervalTime);
      } else if (onTicking == "bottom") {
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
      setIsEnd(true);
    }
  }, [timerTop, timerBottom]);

  return (
    <>
      <main>
        <div className="max-w-lg mx-auto">
          <div className="min-h-screen py-8 px-4 flex flex-col space-y-4 bg-gray-100">
            <div className="flex-grow relative">
              <button
                disabled={onTicking === "top" || isPaused || isEnd}
                className={`block bg-white  text-center w-full shadow-xl rounded-lg outline-none focus:outline-none focus:shadow-sm absolute top-0 bottom-0 overflow-hidden  ${
                  timerTop <= 0 && "bg-red-400"
                }`}
                onClick={() => timerBottomAction()}
              >
                <span className="block font-digital text-gray-600 text-9xl transform rotate-90">
                  {timerTop >= 60000 && getMinutes(timerTop) + ":"}
                  {getSeconds(timerTop)}
                </span>
              </button>
            </div>
            <div className="bg-white flex-grow-0 flex space-x-14 justify-center text-2xl border border-gray-200 rounded-lg px-4 text-center text-gray-400">
              <button
                disabled={!onTicking}
                onClick={() => setIsPaused(!isPaused)}
                className="p-2 m-2 focus:outline-none"
              >
                {isPaused ? <MdPlayArrow></MdPlayArrow> : <MdPause></MdPause>}
              </button>
              <button className="p-2 m-2 focus:outline-none">
                <MdSettings></MdSettings>
              </button>
              <button
                onClick={() => restart()}
                className="p-2 m-2 focus:outline-none"
              >
                <MdReplay></MdReplay>
              </button>
            </div>
            <div className="flex-grow relative">
              <button
                disabled={onTicking === "bottom" || isPaused || isEnd}
                className={`block bg-white text-center w-full shadow-xl rounded-lg outline-none focus:outline-none focus:shadow-sm absolute top-0 bottom-0 overflow-hidden ${
                  timerBottom <= 0 && "bg-red-400"
                }`}
                onClick={() => timerTopAction()}
              >
                <span className="block transform rotate-90 font-digital text-gray-600 text-9xl">
                  {timerBottom >= 60000 && getMinutes(timerBottom) + ":"}
                  {getSeconds(timerBottom)}
                </span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
