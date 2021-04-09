import React, { useEffect, useState } from "react";
import { MdPlayArrow, MdReplay, MdSettings, MdPause } from "react-icons/md";
import Time from "../components/Time";

let intervalTop, intervalBottom;

const Home = () => {
  const intervalTime = 100;
  const increment = 0;
  const [isPaused, setIsPaused] = useState(false);
  const [status, setStatus] = useState("");
  const [timerTop, setTimerTop] = useState(60000);
  const [timerBottom, setTimerBottom] = useState(60000);

  const timerTopAction = () => {
    setStatus("bottom");
    clearInterval(intervalBottom);
    setTimerBottom((timerBottom) => timerBottom + increment);
    intervalTop = setInterval(() => {
      setTimerTop((timerTop) => timerTop - intervalTime);
    }, intervalTime);
  };

  const timerBottomAction = () => {
    setStatus("top");
    clearInterval(intervalTop);
    setTimerTop((timerTop) => timerTop + increment);
    intervalBottom = setInterval(() => {
      setTimerBottom((timerBottom) => timerBottom - intervalTime);
    }, intervalTime);
  };

  const restart = () => {
    clearInterval(intervalTop);
    clearInterval(intervalBottom);
    setTimerTop(60000);
    setTimerBottom(60000);
    setIsPaused(false);
    setStatus("");
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
    }
  }, [timerTop, timerBottom]);

  return (
    <>
      <main>
        <div className="max-w-lg mx-auto">
          <div className="min-h-screen py-4 px-4 flex flex-col space-y-4 bg-gray-100">
            <div className="flex-grow relative">
              <button
                disabled={["top", "end"].includes(status) || isPaused}
                className={`block bg-white  text-center w-full shadow-xl rounded-lg outline-none focus:outline-none focus:shadow-sm absolute top-0 bottom-0 overflow-hidden  ${
                  timerTop <= 0 && "bg-red-400"
                }`}
                onClick={() => timerBottomAction()}
              >
                <Time time={timerTop}></Time>
              </button>
            </div>
            <div className="bg-white flex-grow-0 flex justify-around text-2xl border border-gray-200 rounded-lg px-4 text-center text-gray-400">
              <button
                disabled={!status || status == "end"}
                onClick={() => setIsPaused(!isPaused)}
                className="p-4 focus:outline-none"
              >
                {isPaused ? <MdPlayArrow></MdPlayArrow> : <MdPause></MdPause>}
              </button>
              <button className="p-4 focus:outline-none">
                <MdSettings></MdSettings>
              </button>
              <button
                onClick={() => restart()}
                className="p-4 focus:outline-none"
              >
                <MdReplay></MdReplay>
              </button>
            </div>
            <div className="flex-grow relative">
              <button
                disabled={["end", "bottom"].includes(status) || isPaused}
                className={`block bg-white text-center w-full shadow-xl rounded-lg outline-none focus:outline-none focus:shadow-sm absolute top-0 bottom-0 overflow-hidden ${
                  timerBottom <= 0 && "bg-red-400"
                }`}
                onClick={() => timerTopAction()}
              >
                <Time time={timerBottom}></Time>
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
