import React, { useState } from "react";
import "./App.css";
// import CraniumToolbar from "../components/ui/Toolbar/CraniumToolbar";
import SignIn from "../components/ui/SignIn/signIn";
import Password from "../components/ui/Password/password";
import UploadManifest from "../components/ui/UploadManifest/uploadManifest";
import Load from "../components/ui/Load/load";
import CrateMovement from "../components/ui/CrateMovement/crateMovement";

function App() {
  const [data, setData] = useState(0);

  React.useEffect(() => {
    fetch("/manifest")
      .then((res) => res.json())
      .then((data) => setData(data))
      .then(() => console.log("Response Received"));
  }, []);

  const [screenState, setScreenState] = useState("uploadManifest");
  const [manifest, setManifest] = useState([]);

  return screenState === "signIn" ? (
    <SignIn updateScreenState={() => setScreenState("password")} />
  ) : screenState === "password" ? (
    <Password updateScreenState={() => setScreenState("uploadManifest")} />
  ) : screenState === "uploadManifest" ? (
    <UploadManifest
      updateScreenState={() => setScreenState("load")}
      setManifest={setManifest}
    />
  ) : screenState === "load" ? (
    <Load
      updateScreenState={() => setScreenState("crateMovement")}
      setManifest={setManifest}
      manifest={manifest}
    />
  ) : screenState === "crateMovement" ? (
    <CrateMovement />
  ) : (
    <p>test</p>
  );
  // <Load setScreenState={setScreenState} setManifest={setManifest} manifest={manifest}/>
}

export default App;
