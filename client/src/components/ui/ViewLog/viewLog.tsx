import React, { useState, useEffect } from "react";
import Popup from "reactjs-popup";
import "./viewLog.css";
interface Props {
  manifest: any;
  manifestName: string;
}

export default function ViewLog(props: Props) {
  const { manifest, manifestName } = props;
  const logButton = <button className={"button"}>Log</button>;
  const currentYear = new Date().getFullYear();

  function pad(num: number, size: number) {
    var s = "00000" + num;
    return s.substring(s.length - size);
  }

  const downloadLog = () => {
    let fileData = "";
    manifest.forEach((item: any) => {
      let row =
        "[" +
        pad(item.row, 2) +
        "," +
        pad(item.col, 2) +
        "], {" +
        pad(item.weight, 5) +
        "}, " +
        item.name +
        "\n";
      fileData += row;
    });
    // const fileData = JSON.stringify(manifest);
    const blob = new Blob([fileData], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = "KeoghLongBeach" + currentYear + ".txt";
    link.href = url;
    link.click();
  };

  return (
    <Popup trigger={logButton} modal>
      <div className="modal">
        <div className="modalHeader"> {currentYear} Log </div>
        <div className="modalContent">
          <table className="modalTable">
            <thead>
              <tr>
                <th>Position</th>
                <th>Weight</th>
                <th>Name</th>
              </tr>
            </thead>
            <tbody>
              {manifest &&
                manifest.map((item: any) => (
                  <tr key={item.id}>
                    <td>
                      [{item.row}, {item.col}]
                    </td>
                    <td>{item.weight}</td>
                    <td>{item.name}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
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
