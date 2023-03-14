import React, { useState } from "react";
import "./App.css";
// import CraniumToolbar from "../components/ui/Toolbar/CraniumToolbar";
import SignIn from "../components/ui/SignIn/signIn";
import JobType from "../components/ui/JobType/jobType";
import JobSelect from "../components/ui/JobType/jobSelect";

function App() {
  const [data, setData] = useState(0);

  React.useEffect(() => {
    fetch("/manifest")
      .then((res) => res.json())
      .then((data) => setData(data))
      .then(() => console.log("Response Received"));
  }, []);

  const [screenState, setScreenState] = useState("signIn");

  return screenState === "signIn" ? (
    <JobSelect setScreenState={setScreenState}/>
  ) : (
    <p>test</p>
  );
}

export default App;
