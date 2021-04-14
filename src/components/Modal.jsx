import React, { useContext, useEffect, useState } from "react";
import InputCustom from "./InputCustom";
import SwitchCustom from "./SwitchCustom";
import { AppContext } from "../App";

const Modal = () => {
  const [input, setInput] = useState("test");
  const [enable, setEnable] = useState(false);
  const context = useContext(AppContext);

  useEffect(() => {
    console.log({ input, enable });
  }, [input, enable]);

  useEffect(() => {
    document.body.classList.add("overflow-hidden");
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, []);

  return (
    <div
      className="fixed z-50 bottom-0 left-0 right-0 w-full overflow-auto flex top-0 bg-gray-600 bg-opacity-40"
      onClick={() =>
        context.dispatch({ type: "isModalActive", payload: false })
      }
    >
      <div className="modal fixed h-auto max-w-full bottom-0 right-0 left-0 bg-white overflow-hidden rounded-t-lg">
        <div className="mx-auto max-w-wrapper overflow-x-auto w-full">
          <div className="h-80 bg-white">
            <InputCustom
              value={input}
              type="text"
              label="text input"
              placeholder="input"
              onChange={(e) => setInput(e.target.value)}
            ></InputCustom>
            <SwitchCustom value={enable} onChange={() => setEnable(!enable)} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
