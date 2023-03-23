import React, { useState, useEffect } from "react";
import Popup from "reactjs-popup";
import "./viewButton.css";
import { CraniumContainer } from "../../../types/CraniumContainer";

interface Props {
  manifest: CraniumContainer[];
  manifestName: string;
}

export default function ViewManifest(props: Props) {
  const { manifest, manifestName } = props;
  const manifestButton = (
    <button
      className={"viewButton"}
      // style={{ top: "50px", left: "50px", position: "fixed" }}
    >
      Manifest
    </button>
  );

  function pad(num: number, size: number) {
    var s = "00000" + num;
    return s.substring(s.length - size);
  }

  const downloadManifest = () => {
    let fileData = "";
    manifest.forEach((item) => {
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
    link.download = manifestName.split(".txt")[0] + "_OUTBOUND" + ".txt";
    link.href = url;
    link.click();
  };

  return (
    <Popup trigger={manifestButton} modal>
      <div className="modal">
        <div className="modalHeader"> Manifest </div>
        <div className="modalContent">
          <table className="modalTable">
            <thead>
              <tr>
                <th>Position</th>
                <th>Weight</th>
                <th> Name</th>
              </tr>
            </thead>
            <tbody>
              {manifest &&
                manifest.map((item) => (
                  <tr key={`${item.col},${item.row}`}>
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
          className="viewButton"
          style={{
            textAlign: "center",
            margin: "20px auto",
            display: "block",
            width: "210px",
          }}
          onClick={downloadManifest}
        >
          Download Manifest
        </button>
      </div>
    </Popup>
  );
}
