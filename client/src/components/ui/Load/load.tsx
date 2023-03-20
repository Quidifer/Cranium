import React, { useState, useEffect } from "react";
import "./load.css";
// import UploadManifest from '../UploadManifest/uploadManifest';
// import { ContextMenu, MenuContextContainer } from '../ContextMenu/contextMenu';
import Grid from "../Grid/grid";
import Draggable from "react-draggable";
import OnloadInput from "../OnloadInput/onloadInput";
import ViewManifest from "../ViewManifest/viewManifest";
import ViewLog from "../ViewLog/viewLog";
import CraniumToolbar from "../Toolbar/CraniumToolbar";

interface Props {
  updateScreenState: () => void;
  prevScreenState: (type: string) => void;
  setManifest: any;
  manifest: any;
  manifestName: string;
  duplicates: any;
}

export default function Load(props: Props) {
  const { manifest, manifestName, duplicates, updateScreenState, prevScreenState } = props;
  const [counts, setCounts] = useState<Record<string, number>[]>([]);
  const [onloadContainers, setOnloadContainers] = useState<
    Record<string, number>[]
  >([]);
  const [isGridSelectable, setIsGridSelectable] = useState(true);
  const [selectedCell, setSelectedCell] = useState({
    row: 0,
    col: 0,
    name: "",
    weight: "",
    count: 0,
  });
  const [rightClicked, setRightClicked] = useState(false);

  return (
    <div>
      <div className="split left">
        <CraniumToolbar manifest={manifest} manifestName={manifestName} updateScreenState={updateScreenState}/>
        {/* <div className="parent">
          <div className="child">
            <ViewManifest manifest={manifest} manifestName={manifestName} />
          </div>
          <div className="child">
            <ViewLog manifest={manifest} manifestName={manifestName} />
          </div>
        </div> */}
        <div className="centered flex-container">
          {/* input onload container info */}
          <div
            className="flex-child"
            style={{ border: "solid", backgroundColor: "white" }}
          >
            <OnloadInput
              onloadContainers={onloadContainers}
              setOnloadContainers={setOnloadContainers}
            />
          </div>

          <div className="flex-child">
            <Grid
              manifest={manifest}
              duplicates={duplicates}
              n={8}
              m={12}
              counts={counts}
              isGridSelectable={isGridSelectable}
              selectedCell={selectedCell}
              setSelectedCell={setSelectedCell}
              rightClicked={rightClicked}
              setRightClicked={setRightClicked}
              setCounts={setCounts}
            />
            <button
              onClick={() => {
                setIsGridSelectable(!isGridSelectable);
              }}
              style={{ width: "130px", height: "30px", marginTop: "15px" }}
            >
              {isGridSelectable ? "is selectable" : "is NOT selectable"}
            </button>
          </div>
        </div>
        <div
          style={{
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {rightClicked && (
            <Draggable>
              <div
                style={{
                  height: "117px",
                  width: "230px",
                  backgroundColor: "white",
                  fontSize: "16px",
                  padding: "15px",
                  borderStyle: "solid",
                  position: "relative",
                  overflow: "auto",
                }}
              >
                <button
                  style={{
                    backgroundColor: "rgba(0, 0, 0, 0)",
                    position: "absolute",
                    padding: "0px",
                    height: "25px",
                    width: "25px",
                    fontWeight: "bold",
                    fontSize: "15px",
                    top: "0",
                    left: "calc(100% - 25px)",
                  }}
                  onClick={() => {
                    setRightClicked(!rightClicked);
                  }}
                >
                  x
                </button>
                <div
                  style={{
                    textAlign: "center",
                    fontSize: "12px",
                    fontWeight: "bold",
                    padding: "5px 0 10px 0",
                  }}
                >
                  Selected Container Information
                </div>
                Name: {selectedCell.name} <br />
                Weight: {selectedCell.weight} <br />
                Location: ({selectedCell.row}, {selectedCell.col}) <br />
                Number of Duplicates: {selectedCell.count} <br />
              </div>
            </Draggable>
          )}
        </div>
      </div>

      <div className="split right">
        <div>
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Count</th>
              </tr>
            </thead>
            <tbody>
              {counts &&
                counts.map((item) => (
                  <tr key={item.name}>
                    <td>{item.name}</td>
                    <td>{item.count}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <div>
          <table className="table" style={{ top: "350px" }}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Weight</th>
              </tr>
            </thead>
            <tbody>
              {onloadContainers &&
                onloadContainers.map((item) => (
                  <tr key={item.name}>
                    <td>{item.name}</td>
                    <td>{item.weight}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
