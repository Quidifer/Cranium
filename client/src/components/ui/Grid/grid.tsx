import React, { useState } from "react";
import "./grid.css";
// import UploadManifest from '../UploadManifest/uploadManifest';
// import { ContextMenu, MenuContextContainer } from '../ContextMenu/contextMenu';

interface Props {
  manifest: any;
  n: any;
  m: any;
  counts: any;
  setCounts: any;
  isGridSelectable: any;
}

export default function Grid(props: Props) {
  const { manifest, n, m, counts, setCounts, isGridSelectable } = props;
  const [selectedCells, setSelectedCells] = useState([{ row: 0, col: 0 }]);
  const [selectedNames, setSelectedNames] = useState<string[]>([]);

  const isInList = (list: any, row: any, col: any) => {
    return list.some((item: any) => item.row === row && item.col === col);
  };

  const Tile = (props: any) => {
    const { color, id, row, col, name } = props;
    return (
      <div
        id={id}
        className={isGridSelectable ? `${color} tile` : `nan tile`}
        onMouseDown={() => {
          if (
            isGridSelectable &&
            isInList(manifest, row, col) &&
            name !== "NAN" &&
            name !== "UNUSED"
          ) {
            if (isInList(selectedCells, row, col)) { // deselect cell
              setSelectedCells(
                selectedCells.filter((item) => item.row !== row || item.col !== col)
              );

              let index = counts.findIndex((item: any) => item.name === name);
              let oldCount = counts[index].count;
              if (oldCount == 1) { // last cell is deselected -> unhighlight all duplicate cells
                setSelectedNames(selectedNames.filter((item) => item !== name));
                setCounts(counts.filter((item: any) => item.name !== name));
              } else {
                setCounts(
                  [...counts.slice(0, index)].concat(
                    { ...counts[index], count: oldCount - 1 },
                    [...counts.slice(index + 1)]
                  )
                );
              }
            } else { // select cell
              setSelectedCells([...selectedCells, { row, col }]);

              if (!selectedNames.some((item: any) => item === name))
                setSelectedNames([...selectedNames, name]);

              if (!counts.some((item: any) => item.name === name)) {
                setCounts([...counts, { name: name, count: 1 }]);
              } else {
                let index = counts.findIndex((item: any) => item.name === name);
                let oldCount = counts[index].count;
                setCounts(
                  [...counts.slice(0, index)].concat(
                    { ...counts[index], count: oldCount + 1 },
                    [...counts.slice(index + 1)]
                  )
                );
              }
            }
          }
        }}
        style={{ fontSize: "12px" }}
      >
        {name}
      </div>
    );
  };

  const createBoard = (n: any, m: any) => {
    const board = [];
    for (let row = n; row >= 1; row--) {
      const boardRow = [];
      for (let col = 1; col <= m; col++) {
        let color = "";
        const cell = manifest.find(
          (item: any) => item.row === row && item.col === col
        );
        const name = cell ? cell.name : "";
        if (isInList(manifest, row, col)) {
          if (isInList(selectedCells, row, col)) color = "selected";
          else if (selectedNames.some((item: any) => item === name)) color = "duplicate";
          else if (name === "NAN") color = "nan";
          else color = "unselected";
        } else {
          color = "nan";
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

  return <div>{createBoard(n, m)}</div>;
}
