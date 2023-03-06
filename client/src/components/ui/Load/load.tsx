import React, { useState, useEffect } from 'react';
import "./load.css";
import UploadManifest from '../UploadManifest/uploadManifest';

interface Props {
  setScreenState: React.Dispatch<React.SetStateAction<string>>;
  setManifest: any;
  manifest: any;
}

export default function Load(props: Props) {
  const { setScreenState, setManifest, manifest } = props;
  const [ selectedCells, setselectedCells ] = useState([{ row: 0, col: 0 }]);
  const [ isGridSelectable, setIsGridSelectable ] = useState(false);
  const [ manifestCells, setManifestCells ] = useState([{ row: 0, col: 0, weight: 0, name: "" }]);

  useEffect(() => {
    let cells: any[] = []
    manifest.forEach((element: any) => {
      let row = element.split(',')
      let cell = {
        row: Number(row[0].replace('[', '')), 
        col: Number(row[1].replace(']', '')), 
        weight: Number(row[2].replace('{', '').replace('}', '')),
        name: row[3]
      }
      cells.push(cell)
    });
    setManifestCells([...manifestCells, ...cells])
  }, [])

  const Tile = (props: any) => {
    const { color, id, row, col, name } = props;
    return (
      <div
        id={id}
        className={isGridSelectable ? `${color} tile` : `gray tile`}
        onMouseDown={() => {
          if (isGridSelectable && manifestCells.some(item => item.row === row && item.col === col)) {
            selectedCells.some(item => item.row === row && item.col === col) ?
            setselectedCells(selectedCells.filter(item => item.row !== row || item.col !== col)) :
            setselectedCells([...selectedCells, { row, col }]);
          } 
        }}
        style={{fontSize: "12px"}}
      >
        {name}
      </div>
    );
  };

  const createBoard = (n: any, m: any) => {
    const board = []
    debugger;
    for (let row = 1; row <= n; row++) {
      const boardRow = [];
      for (let col = 1; col <= m; col++) {
        const color = manifestCells.some(item => item.row === row && item.col === col) ? "white" : 
                      // selectedCells.some(item => item.row === row && item.col === col) ? "black" : 
                      "gray";
        const cell = manifestCells.find(item => item.row === row && item.col === col) 
        const name = cell ? cell.name : ""
        boardRow.push(
          <Tile
            key={`${col}${row}`}
            color={color}
            id={`${col},${row}`}
            row={row}
            col={col}
            name={name}
          />
        );
      }
      board.push(
        <div key={`${row}`} className="row">
          {boardRow}
        </div>
      );
    }
    return board;
  };

  return (
    <div>
      <div className="split left">
        <div className="centered"> 
            {createBoard(8, 12)}
            <button
              onClick={() => {
                setIsGridSelectable(!isGridSelectable);
              }}
              style={{ width: "130px", height: "30px", marginTop: "15px" }}
            >{isGridSelectable ? "is selectable" : "is NOT selectable" }</button>
            {/* <p>{manifest}</p> */}
        </div>
      </div>

      <div className="split right">
        <div className="centered">
          <UploadManifest 
            setScreenState={setScreenState}
            setManifest={setManifest}
          />
        </div>
      </div>
    </div>
  );
}