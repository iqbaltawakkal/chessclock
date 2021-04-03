import React, { useState } from "react";
import { MdPlayArrow, MdReplay, MdSettings, MdPause } from "react-icons/md";

const Home = () => {
  const [isPaused, setIsPaused] = useState(false);
  return (
    <>
      <main>
        <div className="max-w-lg mx-auto  ">
          <div className="min-h-screen py-8 px-4 flex flex-col space-y-4 bg-gray-100">
            <div className="  flex-grow relative ">
              <button className="block bg-white font-digital text-gray-600 text-9xl text-center w-full shadow-lg rounded-lg outline-none focus:outline-none focus:shadow-sm absolute top-0 bottom-0 overflow-hidden">
                4.20
              </button>
            </div>
            <div className="bg-white flex-grow-0 flex space-x-14 justify-center text-2xl border-2 border-dashed border-gray-200 rounded-lg px-4 text-center text-gray-400">
              <button
                onClick={() => setIsPaused(!isPaused)}
                className="p-2 m-2 focus:outline-none "
              >
                {isPaused ? <MdPause></MdPause> : <MdPlayArrow></MdPlayArrow>}
              </button>
              <button className="p-2 m-2 focus:outline-none ">
                <MdSettings></MdSettings>
              </button>
              <button className="p-2 m-2 focus:outline-none ">
                <MdReplay></MdReplay>
              </button>
            </div>
            <div className="flex-grow relative ">
              <button className="bg-white block font-digital text-gray-600 text-9xl text-center w-full shadow-lg rounded-lg outline-none focus:outline-none focus:shadow-sm absolute top-0 bottom-0 overflow-hidden">
                10:10
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
