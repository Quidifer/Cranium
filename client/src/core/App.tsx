import React, { useState } from "react";
import "./App.css";
// import CraniumToolbar from "../components/ui/Toolbar/CraniumToolbar";
import SignIn from "../components/ui/SignIn/signIn";
import Password from "../components/ui/Password/password";
import UploadManifest from "../components/ui/UploadManifest/uploadManifest";

function App() {
  const [data, setData] = useState(0);

  React.useEffect(() => {
    fetch("/manifest")
      .then((res) => res.json())
      .then((data) => setData(data))
      .then(() => console.log("Response Received"));
  }, []);

  const [screenState, setScreenState] = useState("signIn");
  const [manifest, setManifest] = useState("");

  return (
    screenState === "signIn" ? <SignIn setScreenState={setScreenState} /> : 
    screenState === "password" ? <Password setScreenState={setScreenState} /> : 
    screenState === "uploadManifest" ? <UploadManifest setScreenState={setScreenState} setManifest={setManifest}/> : 
    (<p>test</p>)
  );
    

  
  // screenState === "signIn" ? (
  //   <SignIn setScreenState={setScreenState} />
  // ) : (
  //   <p>test</p>
  // );
}

export default App;
