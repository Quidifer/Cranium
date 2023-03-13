import React, { useState, useEffect } from "react";
import "./load.css";
// import UploadManifest from '../UploadManifest/uploadManifest';
// import { ContextMenu, MenuContextContainer } from '../ContextMenu/contextMenu';
import Grid from "../Grid/grid";
import Draggable from "react-draggable";

interface Props {
  updateScreenState: () => void;
  manifest: any;
  duplicates: any;
}

export default function Load(props: Props) {
  const { manifest, duplicates } = props;
  const [counts, setCounts] = useState<Record<string, number>[]>([]);
  const [isGridSelectable, setIsGridSelectable] = useState(true);
  const [selectedCell, setSelectedCell] = useState({
    row: 0,
    col: 0,
    name: "",
    weight: "",
    count: 0,
  });
  const [rightClicked, setRightClicked] = useState(false);
  // const [ points, setPoints ] = useState({ x: 0, y: 0 });
  debugger;
  return (
    <div>
      <div className="split left">
        <div className="centered">
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
                  height: "115px",
                  width: "230px",
                  backgroundColor: "white",
                  fontSize: "16px",
                  padding: "15px",
                  borderStyle: "solid"
                }}
              >
                <div style={{textAlign: "center", fontSize: "12px", fontWeight: "bold"}}>Selected Container Information <br /><br /></div> 
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
    </div>
  );
}
