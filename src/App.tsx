import React, { useState } from "react";
import SignIn from "./signIn";
import "./App.css";

// const props = [
//   "password",
//   "signIn",
//   "jobType",
//   "uploadManifest",
//   "modeSelection",
//   "load",
//   "balance",
//   "animationScreen",
// ];

function App() {
  const [screenState, setScreenState] = useState("signIn");

  return screenState === "signIn" ? (
    <SignIn setScreenState={setScreenState} />
  ) : (
    <p>test</p>
  );
}

export default App;
