import React, { useState } from 'react';
import "./load.css";
// import UploadManifest from '../UploadManifest/uploadManifest';

interface Props {
  setScreenState: React.Dispatch<React.SetStateAction<string>>;
  setManifest: any;
  manifest: any;
}

export default function Load(props: Props) {
  const { manifest } = props;
  const [ selectedCells, setselectedCells ] = useState([{ row: 0, col: 0 }]);
  const [ isGridSelectable, setIsGridSelectable ] = useState(true);
  // const [ manifestCells, setManifestCells ] = useState([{ row: 0, col: 0, weight: 0, name: "" }]);

  // useEffect(() => {
  //   let cells: any[] = []
  //   manifest.forEach((element: any) => {
  //     let row = element.split(',')
  //     let cell = {
  //       row: Number(row[0].replace('[', '')), 
  //       col: Number(row[1].replace(']', '')), 
  //       weight: Number(row[2].replace('{', '').replace('}', '')),
  //       name: row[3]
  //     }
  //     cells.push(cell)
  //   });
  //   setManifestCells([...manifestCells, ...cells])
  // }, [])

  const isInList = (list:any, row: any, col: any) => {
    return list.some((item: any) => item.row === row && item.col === col)
  }

  const Tile = (props: any) => {
    const { color, id, row, col, name } = props;
    return (
      <div
        id={id}
        className={isGridSelectable ? `${color} tile` : `gray tile`}
        onMouseDown={() => {
          if (isGridSelectable && isInList(manifest, row, col) && name !== "NAN" && name !== "UNUSED") {
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
    for (let row = n; row >= 1; row--) {
      const boardRow = [];
      for (let col = 1; col <= m; col++) {
        let color = ""
        const cell = manifest.find((item: any) => item.row === row && item.col === col) 
        const name = cell ? cell.name : ""
        if (isInList(manifest, row, col)) {
          if (isInList(selectedCells, row, col)) 
            color = "black"
          else if (name === "NAN") 
            color = "gray"
          else 
            color = "white"
        } else {
          color = "gray"
        }

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
  );
}