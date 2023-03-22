import React, { useState, useEffect } from "react";
import Popup from "reactjs-popup";
import "./viewLog.css";
import API from "../../../utils/API";

interface Props {
}

export default function ViewLog(props: Props) {
  const currentYear = new Date().getFullYear();
  const [log, setLog] = useState("");

  const handleGetLog = () => {
    debugger;
    API.getLog().then((data) => {
      debugger;
      setLog(data);
    });
  };

  const logButton = (
    <button className={"button"} onClick={handleGetLog}>
      Log
    </button>
  );

  const downloadLog = () => {
    debugger;
    // const fileData = JSON.stringify(manifest);
    const blob = new Blob([log], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = "KeoghLongBeach" + currentYear + ".txt";
    link.href = url;
    link.click();
  };

  return (
    <Popup trigger={logButton} onOpen={handleGetLog} modal>
      <div className="modal">
        <div className="modalHeader"> {currentYear} Log </div>
        <div className="modalContent">{log}</div>
        <button
          className={"button"}
          style={{
            textAlign: "center",
            margin: "20px auto",
            display: "block",
            width: "190px",
          }}
          onClick={downloadLog}
        >
          Download Log
        </button>
      </div>
    </Popup>
  );
}