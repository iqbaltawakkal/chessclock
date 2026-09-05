import React, { useContext, useState } from "react";
import SwitchCustom from "./SwitchCustom";
import { AppContext } from "../pages/index";
import { MdClose } from "react-icons/md";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
  RadioGroup,
  Radio,
  Label,
  Description,
} from "@headlessui/react";
import SelectTime from "../components/SelectTime";

const options = [
  { title: "1 Min", subtitle: "Bullet", timer: 60000, increment: 0 },
  { title: "1 + 1", subtitle: "Bullet", timer: 60000, increment: 1000 },
  { title: "2 + 1", subtitle: "Bullet", timer: 120000, increment: 1000 },
  { title: "3 Min", subtitle: "Blitz", timer: 180000, increment: 0 },
  { title: "3 + 2", subtitle: "Blitz", timer: 180000, increment: 2000 },
  { title: "5 Min", subtitle: "Blitz", timer: 300000, increment: 0 },
  { title: "10 Min", subtitle: "Rapid", timer: 600000, increment: 0 },
  { title: "30 Min", subtitle: "Classical", timer: 1800000, increment: 0 },
  { title: "Custom", subtitle: "Manual", timer: 300000, increment: 0 },
];

const Modal = ({ show }) => {
  const { state, dispatch } = useContext(AppContext);
  const [selected, setSelected] = useState(options[3]); // default 3 min blitz
  const isCustom = selected.title === "Custom";

  const close = () => {
    dispatch({ type: "isModalActive", payload: false });
  };

  const handleSelectPreset = (option) => {
    setSelected(option);
    if (option.title !== "Custom") {
      dispatch({ type: "setPreset", payload: { timer: option.timer, increment: option.increment } });
    }
  };

  const getMinutes = (ms) => Math.floor(ms / 60000);
  const getSeconds = (ms) => Math.floor((ms % 60000) / 1000);

  const updateCustomMinutes = (type, currentMs, newMinutes) => {
    const sec = getSeconds(currentMs);
    const totalMs = Number(newMinutes) * 60000 + sec * 1000;
    dispatch({ type, payload: Math.max(1000, totalMs) });
  };

  const updateCustomSeconds = (type, currentMs, newSeconds) => {
    const min = getMinutes(currentMs);
    const totalMs = min * 60000 + Number(newSeconds) * 1000;
    dispatch({ type, payload: Math.max(1000, totalMs) });
  };

  const updateCustomIncrement = (newIncSec) => {
    dispatch({ type: "increment", payload: Number(newIncSec) * 1000 });
  };

  return (
    <Dialog transition open={show} onClose={close} className="relative z-50">
      {/* Backdrop with coordinated smooth opacity transition and no raster blur flicker */}
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-black/60 transition-opacity duration-300 ease-out data-[closed]:opacity-0"
      />

      <div className="fixed inset-0 z-10 flex items-end sm:items-center justify-center p-0 sm:p-4 pointer-events-none">
        <DialogPanel
          transition
          className="pointer-events-auto w-full max-w-lg rounded-t-3xl sm:rounded-2xl bg-white dark:bg-[#0D1117] text-gray-800 dark:text-[#C9D1D9] shadow-2xl border-t sm:border border-gray-200 dark:border-[#30363d] overflow-hidden transition-all duration-300 ease-out data-[closed]:opacity-0 data-[closed]:translate-y-8 sm:data-[closed]:translate-y-0 sm:data-[closed]:scale-95"
        >
          {/* Header */}
          <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 dark:border-[#30363d]">
            <DialogTitle className="text-xl font-bold">Preferences</DialogTitle>
            <button
              type="button"
              onClick={close}
              className="p-1.5 rounded-lg text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none"
            >
              <MdClose className="text-2xl" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
            {/* Presets Radio Group */}
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">
                Time Controls
              </p>
              <RadioGroup value={selected} onChange={handleSelectPreset}>
                <div className="grid grid-cols-3 gap-2.5">
                  {options.map((option) => (
                    <Radio
                      key={option.title}
                      value={option}
                      className={({ checked }) =>
                        `relative flex flex-col items-center justify-center p-3 rounded-xl border cursor-pointer transition-all duration-150 focus:outline-none ${
                          checked
                            ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 ring-2 ring-emerald-500/20 font-semibold shadow-sm"
                            : "border-gray-200 dark:border-[#30363d] bg-gray-50/50 dark:bg-[#161b22] hover:bg-gray-100 dark:hover:bg-[#21262d] text-gray-700 dark:text-gray-300"
                        }`
                      }
                    >
                      <Label className="text-base cursor-pointer">{option.title}</Label>
                      <Description className="text-xs text-gray-400 dark:text-gray-500 cursor-pointer">
                        {option.subtitle}
                      </Description>
                    </Radio>
                  ))}
                </div>
              </RadioGroup>
            </div>

            {/* Custom Timer Settings */}
            {isCustom && (
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-[#161b22] border border-gray-200 dark:border-[#30363d] space-y-3">
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Custom Durations
                </p>

                <div className="flex justify-between items-center">
                  <span className="text-sm">Player 1 Time</span>
                  <div className="flex items-center space-x-1">
                    <SelectTime
                      max={120}
                      value={getMinutes(state.timerTop)}
                      ariaLabel="Player 1 minutes"
                      onChange={(e) => updateCustomMinutes("timerTop", state.timerTop, e.target.value)}
                    />
                    <span className="font-bold">:</span>
                    <SelectTime
                      max={60}
                      value={getSeconds(state.timerTop)}
                      ariaLabel="Player 1 seconds"
                      onChange={(e) => updateCustomSeconds("timerTop", state.timerTop, e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm">Player 2 Time</span>
                  <div className="flex items-center space-x-1">
                    <SelectTime
                      max={120}
                      value={getMinutes(state.timerBottom)}
                      ariaLabel="Player 2 minutes"
                      onChange={(e) => updateCustomMinutes("timerBottom", state.timerBottom, e.target.value)}
                    />
                    <span className="font-bold">:</span>
                    <SelectTime
                      max={60}
                      value={getSeconds(state.timerBottom)}
                      ariaLabel="Player 2 seconds"
                      onChange={(e) => updateCustomSeconds("timerBottom", state.timerBottom, e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-800">
                  <span className="text-sm">Increment (seconds)</span>
                  <SelectTime
                    max={60}
                    value={Math.floor((state.increment || 0) / 1000)}
                    ariaLabel="Increment in seconds"
                    onChange={(e) => updateCustomIncrement(e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Toggles */}
            <div className="pt-2 border-t border-gray-200 dark:border-[#30363d] space-y-1">
              <SwitchCustom
                label="Dark Mode"
                value={state.darkMode}
                onChange={() => dispatch({ type: "darkMode", payload: !state.darkMode })}
              />
              <SwitchCustom
                label="Head-to-Head Clock Flip"
                value={state.flipTimer}
                onChange={() => dispatch({ type: "flipTimer", payload: !state.flipTimer })}
              />
            </div>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default Modal;
