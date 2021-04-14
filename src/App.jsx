import React, { useReducer } from "react";
import Modal from "./components/Modal";

import Index from "./views/Index";

export const AppContext = React.createContext();

function reducer(state, action) {
  switch (action.type) {
    case "timerTop":
      return { ...state, timerTop: action.payload };
    case "timerBottom":
      return { ...state, timerBottom: action.payload };
    case "increment":
      return { ...state, increment: action.payload };
    case "isModalActive":
      return { ...state, isModalActive: action.payload };
    case "timerFacing":
      return { ...state, timerFacing: action.payload };
    default:
      return state;
  }
}

const App = () => {
  const [state, dispatch] = useReducer(reducer, {
    increment: 3000,
    timerTop: 180000,
    timerBottom: 180000,
    timerFacing: "right",
    isModalActive: false,
  });

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      <Index />
      {state.isModalActive && <Modal />}
    </AppContext.Provider>
  );
};

export default App;
