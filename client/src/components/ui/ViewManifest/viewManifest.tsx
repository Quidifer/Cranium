import React, { useState, useEffect } from "react";
import Popup from "reactjs-popup";
import "./viewManifest.css";
interface Props {
  manifest: any;
}

export default function ViewManifest(props: Props) {
  const { manifest } = props;
  const manifestButton = (
    <button
      className={"button"}
      style={{ top: "50px", left: "50px", position: "fixed" }}
    >
      Manifest
    </button>
  );

  return (
    <Popup trigger={manifestButton} modal>
      <div className="modal">
        <div className="modalHeader"> Manifest </div>
        <div className="modalContent">
          <table className="modalTable">
            <thead>
              <tr>
                <th style={{ borderBottom: "2px solid", padding: "5px" }}>Position</th>
                <th style={{ borderBottom: "2px solid" }}>Weight</th>
                <th style={{ borderBottom: "2px solid" }}> Name</th>
              </tr>
            </thead>
            <tbody>
              {manifest &&
                manifest.map((item: any) => (
                  <tr key={item.id}>
                    <td style={{ borderBottom: "1px solid", padding: "5px" }}>
                      [{item.row}, {item.col}]
                    </td>
                    <td style={{ borderBottom: "1px solid" }}>{item.weight}</td>
                    <td style={{ borderBottom: "1px solid" }}>{item.name}</td>
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
        >
          Download Manifest
        </button>
      </div>
    </Popup>
  );
}
