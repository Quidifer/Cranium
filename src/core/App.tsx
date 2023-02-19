import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import CraniumButton from "../components/ui/CraniumButton/CraniumButton";
import CraniumToolbar from "../components/ui/Toolbar/CraniumToolbar";

function App() {
  const variable = "hello world";

  return (
    <div className="App">
      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>{variable}.</p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header> */}
      <CraniumToolbar></CraniumToolbar>
    </div>
  );
}

export default App;
