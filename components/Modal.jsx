import React, { Fragment, useContext, useEffect, useState } from "react";
import SwitchCustom from "./SwitchCustom";
import { AppContext } from "../pages/index";
import PropTypes from "prop-types";
import { MdClose } from "react-icons/md";
import { Transition, RadioGroup } from "@headlessui/react";
import SelectTime from "../components/SelectTime";

const options = [
  {
    title: "1 Min",
    subtitle: "Bullet",
    timer: 60000,
    increment: 0,
  },
  {
    title: "3 Min",
    subtitle: "Blitz",
    timer: 180000,
    increment: 0,
  },
  {
    title: "5 Min",
    subtitle: "Blitz",
    timer: 300000,
    increment: 0,
  },
  {
    title: "1 + 1",
    subtitle: "Bullet",
    timer: 60000,
    increment: 1000,
  },
  {
    title: "2 + 1",
    subtitle: "Bullet",
    timer: 120000,
    increment: 1000,
  },
  {
    title: "3 + 2",
    subtitle: "Blitz",
    timer: 180000,
    increment: 2000,
  },
  {
    title: "10 Min",
    subtitle: "Rapid",
    timer: 600000,
    increment: 0,
  },
  {
    title: "30 Min",
    subtitle: "Classical",
    timer: 1800000,
    increment: 0,
  },
  {
    title: "Custom",
    timer: 60000,
    increment: 0,
  },
];

const Modal = (props) => {
  const context = useContext(AppContext);
  const [darkMode, setDarkMode] = useState(context.state.darkMode);
  const [flipTimer, setFlipTimer] = useState(context.state.flipTimer);
  const [showContent, setShowContent] = useState(false);
  const [showCustom, setShowCustom] = useState(false);
  const [selected, setSelected] = useState(options[0]);
  const [timerTop, setTimerTop] = useState(context.state.timerTop);
  const [timerBottom, setTimerBottom] = useState(context.state.timerBottom);
  const [increment, setIncrement] = useState(context.state.increment);

  useEffect(() => {
    context.dispatch({ type: "darkMode", payload: darkMode });
  }, [darkMode]);

  useEffect(() => {
    context.dispatch({ type: "flipTimer", payload: flipTimer });
  }, [flipTimer]);

  useEffect(() => {
    if (selected.title !== "Custom") {
      context.dispatch({ type: "increment", payload: selected.increment });
      context.dispatch({ type: "timerTop", payload: selected.timer });
      context.dispatch({ type: "timerBottom", payload: selected.timer });
      setShowCustom(false);
    } else {
      setTimeout(() => {
        setShowCustom(true);
      }, 200);
    }
    setTimerBottom(selected.timer);
    setTimerTop(selected.timer);
    setIncrement(selected.increment);
  }, [selected]);

  useEffect(() => {
    if (props.show) {
      document.body.classList.add("overflow-hidden");
      setTimeout(() => {
        setShowContent(true);
      }, 100);
    }
  }, [props.show]);

  const close = () => {
    document.body.classList.remove("overflow-hidden");
    setShowContent(false);
    setTimeout(() => {
      context.dispatch({ type: "isModalActive", payload: false });
    }, 200);
  };

  const getMinutes = (time) => {
    return Math.floor(time / 60000);
  };

  const getSeconds = (time) => {
    return time < 60000
      ? (time - getMinutes(time) * 60000) / 1000
      : Math.floor((time - getMinutes(time) * 60000) / 1000);
  };

  const setCustomTimer = (type, timer) => {
    if (type === "timerBottom") {
      setTimerBottom(timer);
    } else {
      setTimerTop(timer);
    }

    context.dispatch({
      type,
      payload: timer,
    });
  };

  return (
    <>
      {props.show && (
        <div className="fixed z-50 top-0 bottom-0 left-0 right-0 w-full">
          <Transition
            as={Fragment}
            show={showContent}
            enter="transform duration-300"
            enterFrom="max-h-0"
            enterTo="max-h-full"
            leave="transform duration-300"
            leaveFrom="max-h-full"
            leaveTo="max-h-0"
          >
            <div className="fixed h-auto max-w-full bottom-0 right-0 left-0 bg-white dark:bg-[#090C10] overflow-hidden">
              <div className="mx-auto max-w-lg w-full min-h-screen overflow-x-auto">
                <div className="flex justify-between border-b border-gray-200 dark:border-[#30363d] py-4 mx-4">
                  <p className="text-xl font-medium"> Preference</p>
                  <button onClick={() => close()}>
                    <MdClose className="text-2xl"> </MdClose>
                  </button>
                </div>
                <div
                  className="space-y-4 overflow-y-auto px-4 pt-4 pb-8"
                  style={{ height: "calc(100vh - 61px)" }}
                >
                  <RadioGroup value={selected} onChange={setSelected}>
                    <div className="grid grid-cols-3 gap-3">
                      {options.map((option) => (
                        <RadioGroup.Option
                          key={option.title}
                          value={option}
                          className={({ active, checked }) =>
                            `${
                              active
                                ? "ring-2 ring-offset-2 ring-offset-gray-200 ring-white ring-opacity-60"
                                : ""
                            }
                  ${
                    checked
                      ? "bg-gray-500 bg-opacity-75 text-white"
                      : "bg-white dark:bg-[#0D1117] border border-gray-200 dark:border-[#30363d]"
                  }
                    relative h-24 flex flex-col items-center justify-center rounded-lg shadow-md p-4 cursor-pointer focus:outline-none`
                          }
                        >
                          {
                            <>
                              <RadioGroup.Label
                                key={option.title}
                                as="p"
                                className="font-medium"
                              >
                                {option.title}
                              </RadioGroup.Label>
                              <p className="text-sm">{option.subtitle}</p>
                            </>
                          }
                        </RadioGroup.Option>
                      ))}
                    </div>
                  </RadioGroup>

                  <Transition
                    as="div"
                    show={showCustom}
                    enter="transform duration-500"
                    enterFrom="max-h-0"
                    enterTo="max-h-full"
                    leave="transform"
                    leaveFrom="max-h-full"
                    leaveTo="max-h-0"
                    className="space-y-4"
                  >
                    <div className="flex justify-between ">
                      <span>Timer #1</span>
                      <div>
                        <SelectTime
                          max={100}
                          value={getMinutes(timerTop)}
                          onChange={(e) => {
                            setCustomTimer(
                              "timerTop",
                              getSeconds(timerTop) * 1000 +
                                e.target.value * 60000
                            );
                          }}
                        />
                        <span className="mx-2">:</span>
                        <SelectTime
                          max={60}
                          value={getSeconds(timerTop)}
                          onChange={(e) => {
                            setCustomTimer(
                              "timerTop",
                              timerTop + e.target.value * 1000
                            );
                          }}
                        />
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span>Timer #2</span>
                      <div>
                        <SelectTime
                          max={100}
                          value={getMinutes(timerBottom)}
                          onChange={(e) => {
                            setCustomTimer(
                              "timerBottom",
                              getSeconds(timerBottom) * 1000 +
                                e.target.value * 60000
                            );
                          }}
                        />
                        <span className="mx-2">:</span>
                        <SelectTime
                          max={60}
                          value={getSeconds(timerBottom)}
                          onChange={(e) => {
                            setCustomTimer(
                              "timerBottom",
                              timerBottom + e.target.value * 1000
                            );
                          }}
                        />
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span>Increment </span>
                      <SelectTime
                        max={60}
                        value={increment}
                        onChange={(e) => {
                          setIncrement(e.target.value);
                          context.dispatch({
                            type: "increment",
                            payload: parseInt(e.target.value * 1000),
                          });
                        }}
                      />
                    </div>
                  </Transition>

                  <SwitchCustom
                    label="Dark Mode"
                    value={darkMode}
                    onChange={() => setDarkMode(!darkMode)}
                  />
                  <SwitchCustom
                    label="Flip Timer"
                    value={flipTimer}
                    onChange={() => setFlipTimer(!flipTimer)}
                  />
                </div>
              </div>
            </div>
          </Transition>
        </div>
      )}
    </>
  );
};

Modal.propTypes = {
  show: PropTypes.bool.isRequired,
};

export default Modal;
