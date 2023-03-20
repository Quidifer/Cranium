import React, { useState } from "react";
import "./App.css";
// import CraniumToolbar from "../components/ui/Toolbar/CraniumToolbar";
import SignIn from "../components/ui/SignIn/signIn";
import Password from "../components/ui/Password/password";
import UploadManifest from "../components/ui/UploadManifest/uploadManifest";
import Load from "../components/ui/Load/load";
import CrateMovement from "../components/ui/CrateMovement/crateMovement";

const moveSet = [
  {
    row_start: 6,
    col_start: 4,
    row_end: 1,
    col_end: 10,
    move_type: "SHIP_MOVE",
    step: 1,
  },
  {
    row_start: 5,
    col_start: 4,
    row_end: 2,
    col_end: 10,
    move_type: "SHIP_MOVE",
    step: 2,
  },
  {
    row_start: 4,
    col_start: 4,
    row_end: 3,
    col_end: 10,
    move_type: "SHIP_MOVE",
    step: 3,
  },
  {
    row_start: 3,
    col_start: 4,
    row_end: 4,
    col_end: 10,
    move_type: "SHIP_MOVE",
    step: 4,
  },
  {
    row_start: 2,
    col_start: 4,
    row_end: 5,
    col_end: 10,
    move_type: "SHIP_MOVE",
    step: 5,
  },
  {
    row_start: 1,
    col_start: 4,
    row_end: -1,
    col_end: -1,
    move_type: "OFFLOAD",
    step: 6,
  },
  {
    row_start: -1,
    col_start: -1,
    row_end: 2,
    col_end: 0,
    move_type: "ONLOAD",
    step: 7,
  },
];

function App() {
  const [data, setData] = useState(0);

  React.useEffect(() => {
    fetch("/manifest")
      .then((res) => res.json())
      .then((data) => setData(data))
      .then(() => console.log("Response Received"));
  }, []);

  const [screenState, setScreenState] = useState("signIn");
  const [manifest, setManifest] = useState([]);
  const [duplicates, setDuplicates] = useState([]);
  const [manifestName, setManifestName] = useState("");

  return screenState === "signIn" ? (
    <SignIn updateScreenState={() => setScreenState("password")} />
  ) : screenState === "password" ? (
    <Password updateScreenState={() => setScreenState("uploadManifest")} />
  ) : screenState === "uploadManifest" ? (
    <UploadManifest
      updateScreenState={() => setScreenState("load")}
      setManifest={setManifest}
      setDuplicates={setDuplicates}
      duplicates={duplicates}
      setManifestName={setManifestName}
    />
  ) : screenState === "load" ? (
    <Load
      updateScreenState={() => setScreenState("crateMovement")}
      manifest={manifest}
      manifestName={manifestName}
      duplicates={duplicates}
    />
  ) : screenState === "crateMovement" ? (
    <CrateMovement
      setManifest={setManifest}
      manifest={manifest}
      moveSet={moveSet}
    />
  ) : (
    <p>test</p>
  );
  // <Load setScreenState={setScreenState} setManifest={setManifest} manifest={manifest}/>
}

export default App;
