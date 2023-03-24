import React, { useState } from "react";
import "./App.css";
// import CraniumToolbar from "../components/ui/Toolbar/CraniumToolbar";
import SignIn from "../components/ui/SignIn/signIn";
import Password from "../components/ui/Password/password";
import UploadManifest from "../components/ui/UploadManifest/uploadManifest";
import Load from "../components/ui/Load/load";
import CrateMovement from "../components/ui/CrateMovement/crateMovement";
import JobSelect from "../components/ui/JobSelect/jobSelect";
import { FrontEndContainer } from "../types/APISolution";
import Calculating from "../components/ui/Calculating/Calculating";
import API from "../utils/API";
import { APISolution } from "../types/APISolution";
import { CraniumContainer } from "../types/CraniumContainer";

let data: APISolution | null = null;

API.getSolution().then((_data) => {
  data = _data;
});

function App() {
  const [screenState, setScreenState] = useState("password");
  const [manifest, setManifest] = useState<CraniumContainer[]>([]);
  const [manifestName, setManifestName] = useState("");
  const [buffer, setBuffer] = useState<FrontEndContainer[]>(() => {
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
  const [prevScreenState, setPrevScreenState] = useState("uploadManifest");

  const [moveSet, setMoveSet] = useState<APISolution>(
    data
      ? data
      : {
          username: "",
          moves: [],
          index: -1,
          final_manifest: [],
        }
  );
  const [currentStep, setCurrentStep] = useState(data ? data.index : 0);

  return screenState === "password" ? (
    <Password
      updateScreenState={() => setScreenState("signIn")}
      restoreSession={() => setScreenState("calculating")}
    />
  ) : screenState === "signIn" ? (
    <SignIn updateScreenState={() => setScreenState(prevScreenState)} />
  ) : screenState === "uploadManifest" ? (
    <UploadManifest
      updateScreenState={() => setScreenState("jobSelect")}
      updatePrevScreenState={() => setPrevScreenState("uploadManifest")}
      setManifest={setManifest}
      setManifestName={setManifestName}
      manifestName={manifestName}
    />
  ) : screenState === "jobSelect" ? (
    <JobSelect
      updateScreenState={(type: string) => {
        if (type === "Load") {
          setScreenState("load");
        } else {
          console.log("sending balance job...");
          API.sendJob("BALANCE", manifest, [], []);
          setScreenState("calculating");
        }
      }}
      prevScreenState={() => setPrevScreenState("jobSelect")}
    />
  ) : screenState === "load" ? (
    <Load
      updateScreenState={() => {
        setScreenState("calculating");
      }}
      updatePrevScreenState={() => setPrevScreenState("load")}
      goToSignIn={() => setScreenState("signIn")}
      manifest={manifest}
      manifestName={manifestName}
      setCurrentStep={setCurrentStep}
      setManifestName={setManifestName}
      setManifest={setManifest}
      setBuffer={setBuffer}
    />
  ) : screenState === "calculating" ? (
    <Calculating
      updateScreenState={() => {
        API.getSolution().then((data) => {
          console.log(data);
          if (data) {
            setMoveSet(data);
            setCurrentStep(data.index);
            setManifest(data.moves[data.index].manifest);
            setBuffer(data.moves[data.index].buffer);
            setScreenState("crateMovement");
          }
        });
      }}
    />
  ) : screenState === "crateMovement" ? (
    <CrateMovement
      updateScreenState={() => setScreenState("uploadManifest")}
      updatePrevScreenState={() => setPrevScreenState("crateMovement")}
      goToSignIn={() => setScreenState("signIn")}
      setManifest={setManifest}
      manifest={manifest}
      setManifestName={setManifestName}
      manifestName={manifestName}
      buffer={buffer}
      setBuffer={setBuffer}
      moveSet={moveSet}
      currentStep={currentStep}
      setCurrentStep={setCurrentStep}
    />
  ) : (
    <p>test</p>
  );
}
export default App;
