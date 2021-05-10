import Head from "next/head";
import Modal from "../components/Modal";
import Base from "../components/Base";
import React, { useReducer, useEffect } from "react";

export const AppContext = React.createContext();

function reducer(state, action) {
  switch (action.type) {
    case "timerTop":
      return {
        ...state,
        timerTop: action.payload,
        updateComponent: state.updateComponent + 1,
      };
    case "timerBottom":
      return {
        ...state,
        timerBottom: action.payload,
        updateComponent: state.updateComponent + 1,
      };
    case "increment":
      return {
        ...state,
        increment: action.payload,
        updateComponent: state.updateComponent + 1,
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
  const [state, dispatch] = useReducer(reducer, {
    increment: 0,
    timerTop: 0,
    timerBottom: 0,
    darkMode: false,
    flipTimer: false,
    isModalActive: false,
    updateComponent: 1,
  });

  useEffect(() => {
    if (state.darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [state.darkMode]);

  return (
    <main className="dark:text-[#C9D1D9] bg-gray-200 dark:bg-[#090C10]">
      <Head>
        <title>Chess clock</title>
        <meta
          name="viewport"
          content="initial-scale=1.0, width=device-width"
          key="viewport"
        />
        <meta charSet="UTF-8"></meta>
        <meta name="description" content="Simple chess clock online."></meta>
        <meta name="robots" content="index, follow"></meta>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AppContext.Provider value={{ state, dispatch }}>
        <Base key={state.updateComponent} />
        <Modal show={state.isModalActive} />
      </AppContext.Provider>
    </main>
  );
}
