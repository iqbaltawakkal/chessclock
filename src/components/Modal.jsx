import React, { Fragment, useContext, useEffect, useState } from "react";
import SwitchCustom from "./SwitchCustom";
import { AppContext } from "../App";
import PropTypes from "prop-types";
import { MdClose } from "react-icons/md";
import { Transition, RadioGroup } from "@headlessui/react";

const options = [
  {
    title: "1 Min",
    subtitle: "",
    timer: 60000,
    increment: 0,
  },
  {
    title: "3 Min",
    timer: 180000,
    increment: 0,
  },
  {
    title: "5 Min",
    timer: 300000,
    increment: 0,
  },
  {
    title: "1 + 1",
    timer: 60000,
    increment: 1000,
  },
  {
    title: "2 + 1",
    timer: 120000,
    increment: 1000,
  },
  {
    title: "3 + 2",
    timer: 180000,
    increment: 2000,
  },
  {
    title: "10 Min",
    timer: 600000,
    increment: 0,
  },
  {
    title: "30 Min",
    timer: 1800000,
    increment: 0,
  },
  {
    title: "Custom",
  },
];

const Modal = (props) => {
  const context = useContext(AppContext);
  const [darkMode, setDarkMode] = useState(context.state.darkMode);
  const [flipTimer, setFlipTimer] = useState(context.state.flipTimer);
  const [showContent, setShowContent] = useState(false);
  const [selected, setSelected] = useState(options[0]);

  useEffect(() => {
    context.dispatch({ type: "darkMode", payload: darkMode });
  }, [darkMode]);

  useEffect(() => {
    context.dispatch({ type: "flipTimer", payload: flipTimer });
  }, [flipTimer]);

  useEffect(() => {
    context.dispatch({ type: "increment", payload: selected.increment });
    context.dispatch({ type: "timerTop", payload: selected.timer });
    context.dispatch({ type: "timerBottom", payload: selected.timer });
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

  return (
    <>
      {props.show && (
        <div className="fixed z-50 top-0 bottom-0 left-0 right-0 w-full overflow-auto">
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
              <div className="mx-auto max-w-lg overflow-x-auto w-full min-h-screen px-4 space-y-4 ">
                <div className="flex border-b border-gray-200 dark:border-[#30363d] py-4 ">
                  <button onClick={() => close()}>
                    <MdClose className="text-2xl mr-2"> </MdClose>
                  </button>
                  <p className="text-xl"> Preference</p>
                </div>

                <RadioGroup value={selected} onChange={setSelected}>
                  <div className="grid grid-cols-3 gap-3">
                    {options.map((option) => (
                      <RadioGroup.Option
                        key={option.name}
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
                    relative h-24 flex items-center justify-center rounded-lg shadow-md px-5 py-4 cursor-pointer focus:outline-none`
                        }
                      >
                        {({ checked }) => (
                          <>
                            <RadioGroup.Label
                              as="p"
                              className={`font-medium text-center ${
                                checked ? "text-white" : ""
                              }`}
                            >
                              {option.title}
                            </RadioGroup.Label>
                          </>
                        )}
                      </RadioGroup.Option>
                    ))}
                  </div>
                </RadioGroup>
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
