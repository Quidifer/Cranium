import React, { useState, useEffect } from 'react';
import "./load.css";
// import UploadManifest from '../UploadManifest/uploadManifest';
// import { ContextMenu, MenuContextContainer } from '../ContextMenu/contextMenu';

interface Props {
  setScreenState: React.Dispatch<React.SetStateAction<string>>;
  setManifest: any;
  manifest: any;
}

export default function Load(props: Props) {
  const { manifest } = props;
  const [ selectedCells, setSelectedCells ] = useState([{ row: 0, col: 0 }]);
  const [ selectedNames, setSelectedNames ] = useState<string[]>([]);
  const [ counts, setCounts ] = useState<Record<string, number>[]>([]);
  const [ isGridSelectable, setIsGridSelectable ] = useState(true);
  // const [ clicked, setClicked ] = useState(false);
  // const [ points, setPoints ] = useState({ x: 0, y: 0 });

  // useEffect(() => {
  //   const handleClick = () => setClicked(false);
  //   window.addEventListener("click", handleClick);
  //   return () => {
  //     window.removeEventListener("click", handleClick);
  //   };
  // }, []);

  const isInList = (list:any, row: any, col: any) => {
    return list.some((item: any) => item.row === row && item.col === col)
  }

  const Tile = (props: any) => {
    const { color, id, row, col, name } = props;
    return (
      <div
        id={id}
        className={isGridSelectable ? `${color} tile` : `nan tile`}
        onMouseDown={() => {
            if (isGridSelectable && isInList(manifest, row, col) && name !== "NAN" && name !== "UNUSED") {
              if (isInList(selectedCells, row, col)) { // deselect cell
                setSelectedCells(selectedCells.filter(item => item.row !== row || item.col !== col))
                
                let index = counts.findIndex((item => item.name === name));
                let oldCount = counts[index].count;
                if (oldCount == 1) { // last cell is deselected -> unhighlight all duplicate cells
                  setSelectedNames(selectedNames.filter(item => item !== name))
                  setCounts(counts.filter(item => item.name !== name))
                } else {
                  setCounts([...counts.slice(0, index)].concat(
                            {...counts[index], count: oldCount - 1}, 
                            [...counts.slice(index+1)]))
                }
              } else { // select cell
                setSelectedCells([...selectedCells, { row, col }])
  
                if (!selectedNames.some((item: any) => item === name)) 
                  setSelectedNames([...selectedNames, name])
                
                if (!counts.some((item: any) => item.name === name)) {
                  setCounts([...counts, {name: name, count: 1}])
                } else {
                  let index = counts.findIndex((item => item.name === name))
                  let oldCount = counts[index].count
                  setCounts([...counts.slice(0, index)].concat(
                            {...counts[index], count: oldCount + 1}, 
                            [...counts.slice(index+1)]))
                }
              }
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
            color = "selected"
          else if (selectedNames.some((item: any) => item === name))
            color = "duplicate"
          else if (name === "NAN") 
            color = "nan"
          else 
            color = "unselected"
        } else {
          color = "nan"
        }

        boardRow.push(
          // <div
          //   onContextMenu={(e) => {
          //     e.preventDefault();
          //     setClicked(true);
          //     setPoints({
          //       x: e.pageX,
          //       y: e.pageY,
          //     });
          //   }}
          // >
            <Tile
              key={`${col}${row}`}
              color={color}
              id={`${col},${row}`}
              row={row}
              col={col}
              name={name}
              // onContextMenu={(e: any) => {
              //   e.preventDefault();
              //   setClicked(true);
              //   setPoints({
              //     x: e.pageX,
              //     y: e.pageY,
              //   });
              // }}
            />
          // </div>
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
          {/* {clicked && (
            <ContextMenu top={points.y} left={points.x}>
              <ul>
                <li>Edit</li>
                <li>Copy</li>
                <li>Delete</li>
              </ul>
            </ContextMenu>
          )} */}
          
          <button
            onClick={() => {
              setIsGridSelectable(!isGridSelectable);
            }}
            style={{ width: "130px", height: "30px", marginTop: "15px" }}>
            {isGridSelectable ? "is selectable" : "is NOT selectable" }
          </button>
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
            {counts && counts.map(item =>
              <tr key={item.name}>
                <td>{item.name}</td>
                <td>{item.count}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}