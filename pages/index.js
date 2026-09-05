import Head from "next/head";
import Modal from "../components/Modal";
import Base from "../components/Base";
import React, { useReducer, useEffect } from "react";

export const AppContext = React.createContext();

const initialState = {
  increment: 0,
  timerTop: 180000, // 3 min default blitz
  timerBottom: 180000,
  darkMode: false,
  flipTimer: true,
  isModalActive: false,
};

function reducer(state, action) {
  switch (action.type) {
    case "setPreset":
      return {
        ...state,
        timerTop: action.payload.timer,
        timerBottom: action.payload.timer,
        increment: action.payload.increment,
      };
    case "timerTop":
      return {
        ...state,
        timerTop: action.payload,
      };
    case "timerBottom":
      return {
        ...state,
        timerBottom: action.payload,
      };
    case "increment":
      return {
        ...state,
        increment: action.payload,
      };
    case "isModalActive":
      return { ...state, isModalActive: action.payload };
    case "flipTimer":
      return { ...state, flipTimer: action.payload };
    case "darkMode":
      return { ...state, darkMode: action.payload };
    default:
      return state;
  }
}

export default function Home() {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    // Check saved dark mode or system preference on mount
    const savedTheme = localStorage.getItem("chess_clock_dark");
    if (savedTheme !== null) {
      dispatch({ type: "darkMode", payload: savedTheme === "true" });
    } else if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      dispatch({ type: "darkMode", payload: true });
    }
  }, []);

  useEffect(() => {
    if (state.darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("chess_clock_dark", "true");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("chess_clock_dark", "false");
    }
  }, [state.darkMode]);

  return (
    <main className="min-h-screen dark:text-[#C9D1D9] bg-gray-100 dark:bg-[#090C10] transition-colors duration-200">
      <Head>
        <title>Chess Clock — Precision Blitz & Rapid Clock</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover"
          key="viewport"
        />
        <meta charSet="UTF-8" />
        <meta
          name="description"
          content="Ultra-responsive, zero-latency digital chess clock for Bullet, Blitz, and Rapid chess."
        />
        <meta name="robots" content="index, follow" />
        <link rel="manifest" href="/manifest.json" />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/icons/icon-16x16.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/icons/icon-32x32.png"
        />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta
          name="theme-color"
          content={state.darkMode ? "#090C10" : "#F3F4F6"}
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <AppContext.Provider value={{ state, dispatch }}>
        <Base />
        <Modal show={state.isModalActive} />
      </AppContext.Provider>
    </main>
  );
}
