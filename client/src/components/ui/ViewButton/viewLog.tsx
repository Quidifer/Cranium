import React, { useState, useEffect } from "react";
import Popup from "reactjs-popup";
import "./viewButton.css";
import API from "../../../utils/API";

interface Props {}

export default function ViewLog(props: Props) {
  const currentYear = new Date().getFullYear();
  const logName = `KeoghLongBeach${currentYear}.txt`;
  const [log, setLog] = useState("");

  const handleGetLog = () => {
    API.getLog().then((data) => {
      setLog(data);
    });
  };

  const downloadLog = () => {
    // const fileData = JSON.stringify(manifest);
    const blob = new Blob([log], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = logName;
    link.href = url;
    link.click();
  };

  return (
    <Popup
      trigger={<button className="viewButton">Log</button>}
      onOpen={handleGetLog}
      modal
    >
      <div className="modal">
        <div className="modalHeader"> {currentYear} Log </div>
        <div className="modalContent">{log}</div>
        <button
          className="viewButton"
          style={{
            textAlign: "center",
            margin: "20px auto",
            display: "block",
            width: "200px",
            boxShadow: "none",
          }}
          onClick={() => {
            downloadLog();
            console.log(`${logName} is downloaded.`, 'NONE');
            API.sendLog(`${logName} is downloaded.`, 'NONE');
          }}
        >
          Download Log
        </button>
      </div>
    </Popup>
  );
}
