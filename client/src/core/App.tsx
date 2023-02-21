import React, { useState } from "react";
import "./App.css";
import CraniumToolbar from "../components/ui/Toolbar/CraniumToolbar";

function App() {

  const [ data, setData ] = useState(0);

  React.useEffect(() => {
    fetch("/manifest")
      .then((res) => res.json())
      .then((data) => setData(data))
      .then(() => console.log("Response Received"));
  }, []);
  

  return (
    <div className="App">
      <CraniumToolbar></CraniumToolbar>
      <p>Hello World!</p>
      <p>{!data ? "Loading." : JSON.stringify(data)}</p>
    </div>
  );
}

export default App;
