import React, { useState } from "react";
import "./App.css";
// import CraniumToolbar from "../components/ui/Toolbar/CraniumToolbar";
import SignIn from "../components/ui/SignIn/signIn";
import Password from "../components/ui/Password/password";
import UploadManifest from "../components/ui/UploadManifest/uploadManifest";
import Load from "../components/ui/Load/load";
import CrateMovement from "../components/ui/CrateMovement/crateMovement";
import JobSelect from "../components/ui/JobSelect/jobSelect";
import { stringify } from "uuid";

const moveSet = [
  {
    row_start: 6,
    col_start: 4,
    row_end: 1,
    col_end: 10,
    move_type: "SHIP_TO_BUFFER",
    container_name: "your mom is soooo gay lollllllll",
    container_weight: 9999,
  },
  {
    row_start: 5,
    col_start: 4,
    row_end: 2,
    col_end: 10,
    move_type: "SHIP_MOVE",
    container_name: "your mom",
    container_weight: 100,
  },
  {
    row_start: 4,
    col_start: 4,
    row_end: 3,
    col_end: 10,
    move_type: "SHIP_MOVE",
    container_name: "your mom",
    container_weight: 100,
  },
  {
    row_start: 3,
    col_start: 4,
    row_end: 4,
    col_end: 10,
    move_type: "SHIP_MOVE",
    container_name: "your mom",
    container_weight: 100,
  },
  {
    row_start: 2,
    col_start: 4,
    row_end: 5,
    col_end: 10,
    move_type: "SHIP_MOVE",
    container_name: "your mom",
    container_weight: 100,
  },
  {
    row_start: 1,
    col_start: 4,
    row_end: -1,
    col_end: -1,
    move_type: "OFFLOAD",
    container_name: "your mom",
    container_weight: 100,
  },
  {
    row_start: -1,
    col_start: -1,
    row_end: 2,
    col_end: 1,
    move_type: "ONLOAD",
    container_name: "your mom is soooo gay lollllllll",
    container_weight: 100,
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

  const [screenState, setScreenState] = useState("load");
  const [manifest, setManifest] = useState([]);
  const [buffer, setBuffer] = useState(() => {
    let cells: { row: number; col: number; weight: number; name: string }[] =
      [];
    for (let r = 1; r <= 4; ++r) {
      for (let c = 1; c <= 24; ++c) {
        cells.push({
          row: r,
          col: c,
          weight: 0,
          name: "UNUSED",
        });
      }
    }
    return cells;
  });
  const [duplicates, setDuplicates] = useState([]);
  const [manifestName, setManifestName] = useState("");
  const [prevScreenState, setPrevScreenState] = useState("");

  return screenState === "password" ? (
    <Password
      updateScreenState={() => setScreenState("signIn")}
      updatePrevScreenState={() => setPrevScreenState("password")}
    />
  ) : screenState === "signIn" ? (
      <SignIn updateScreenState={() => setScreenState("uploadManifest")}
      updatePrevScreenState={() => setPrevScreenState("signIn")} />
  ) : screenState === "uploadManifest" ? (
    <UploadManifest
      updateScreenState={() => setScreenState("jobSelect")}
      updatePrevScreenState={() => setPrevScreenState("UploadManifest")}
      setManifest={setManifest}
      setDuplicates={setDuplicates}
      duplicates={duplicates}
      setManifestName={setManifestName}
    />
  ) : screenState === "jobSelect" ? (
    <JobSelect
      updateScreenState={(type: string) =>
        type === "Load" ? setScreenState("load") : setScreenState("load")
      }
      prevScreenState={() => setPrevScreenState("JobSelect")}
    />
  ) : screenState === "load" ? (
    <Load
      updateScreenState={() => setScreenState("crateMovement")}
      setManifest={setManifest}
      manifest={manifest}
      manifestName={manifestName}
      duplicates={duplicates}
      updatePrevScreenState={() => setPrevScreenState("load")}
      goToSignIn={() => setScreenState("signInReturnState")}
    />
  ) :  screenState === "signInReturnState" ? (
    <SignIn
      updateScreenState={() => setScreenState("load")}
      updatePrevScreenState={() => setPrevScreenState("load")}
    />
  ) : screenState === "crateMovement" ? (
    <CrateMovement
      setManifest={setManifest}
      manifest={manifest}
      manifestName={manifestName}
      buffer={buffer}
      setBuffer={setBuffer}
      moveSet={moveSet}
      updatePrevScreenState={() => setPrevScreenState("crateMovement")}
      updateScreenState={() => setScreenState("crateMovement")}
      goToSignIn={() => setScreenState("signInReturnState")}
    />
  ) : (
    <p>test</p>
  );
  // <Load setScreenState={setScreenState} setManifest={setManifest} manifest={manifest}/>
}

export default App;
