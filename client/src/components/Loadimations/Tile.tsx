import "./Tile.css";
import React, { useState } from "react";
import { CraniumContainer } from "../../types/CraniumContainer";
import { CraniumCount } from "../../types/CraniumCount";

interface Props {
  key: string;
  row: number;
  col: number;
  name: string;
  weight: number;
  count: number;
  color: string;
  scale: number;
  tileHeight: number;
  widthScale: number;
  manifest: CraniumContainer[];
  rightClicked: boolean;
  setRightClicked: React.Dispatch<React.SetStateAction<boolean>>;
  counts: CraniumCount[];
  setCounts: React.Dispatch<React.SetStateAction<CraniumCount[]>>;
  selectedCell: CraniumContainer;
  setSelectedCell: React.Dispatch<React.SetStateAction<CraniumContainer>>;
  selectedCells: CraniumContainer[];
  setSelectedCells: React.Dispatch<React.SetStateAction<CraniumContainer[]>>;
  selectedNames: string[];
  setSelectedNames: React.Dispatch<React.SetStateAction<string[]>>;
}

export function Tile(props: Props) {
  const {
    key,
    row,
    col,
    name,
    weight,
    count,
    color,
    scale,
    tileHeight,
    widthScale,
    manifest,
    rightClicked,
    setRightClicked,
    counts,
    setCounts,
    selectedCell,
    setSelectedCell,
    selectedCells,
    setSelectedCells,
    selectedNames,
    setSelectedNames,
  } = props;

  const isInList = (list: CraniumContainer[], row: number, col: number) => {
    return list.some((item) => item.row === row && item.col === col);
  };

  return (
    <div
      style={{
        height: `${scale * tileHeight}px`,
        width: `${scale * (tileHeight * widthScale)}px`,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        id={key}
        style={{
          position: "absolute",
          height: `${scale * tileHeight}px`,
          width: `${scale * (tileHeight * widthScale)}px`,
          display: "flex",
          overflow: "hidden",
          justifyContent: "center",
          alignItems: "center",
          border:
            color === "nan" ? "1px solid #2e2e2e" : "1px solid rgb(46, 46, 46)",
          borderRadius: name !== "" ? `${scale * 1.6}px` : "",
        }}
      >
        <p style={{ fontSize: `${scale * 0.5}rem` }}>{name}</p>
      </div>
      <div
        id={key}
        className={`${color}`}
        onContextMenu={(e) => {
          // right click
          e.preventDefault();
          setRightClicked(!rightClicked);
        }}
        onMouseDown={(e) => {
          if (e.button === 0) {
            // left click
            console.log("left click");
            if (
              isInList(manifest, row, col) &&
              name !== "NAN" &&
              name !== "UNUSED"
            ) {
              selectedCell.row === row && selectedCell.col === col
                ? setSelectedCell({
                    row: 0,
                    col: 0,
                    name: "",
                    weight: 0,
                  })
                : setSelectedCell({
                    row: row,
                    col: col,
                    name: name,
                    weight: weight,
                  });
              if (isInList(selectedCells, row, col)) {
                // deselect cell
                setSelectedCells(
                  selectedCells.filter(
                    (item) => item.row !== row || item.col !== col
                  )
                );

                let index = counts.findIndex((item) => item.name === name);
                let oldCount = counts[index].count;
                if (oldCount === 1) {
                  // last cell is deselected -> unhighlight all duplicate cells
                  setSelectedNames(
                    selectedNames.filter((item) => item !== name)
                  );
                  setCounts(counts.filter((item) => item.name !== name));
                } else {
                  setCounts(
                    [...counts.slice(0, index)].concat(
                      { ...counts[index], count: oldCount - 1 },
                      [...counts.slice(index + 1)]
                    )
                  );
                }
              } else {
                // select cell
                setSelectedCells([
                  ...selectedCells,
                  { name, weight, row, col },
                ]);

                if (!selectedNames.some((item) => item === name))
                  setSelectedNames([...selectedNames, name]);

                if (!counts.some((item) => item.name === name)) {
                  setCounts([...counts, { name: name, count: 1 }]);
                } else {
                  let index = counts.findIndex((item) => item.name === name);
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
          }
        }}
        style={{
          position: "absolute",
          height: `${scale * (tileHeight - 1)}px`,
          width: `${scale * (tileHeight * widthScale - 1)}px`,
          display: "flex",
          overflow: "hidden",
          justifyContent: "center",
          alignItems: "center",
          border:
            color === "nan"
              ? `${scale * 0.8}px solid rgba(46, 46, 46, 0.3)`
              : `${scale * 0.8}px solid rgb(46, 46, 46)`,
          borderRadius: name !== "" ? `${scale * 1.6}px` : "",
        }}
      >
        <p style={{ fontSize: `${scale * 0.8}rem` }}>{name}</p>
      </div>
    </div>
  );
}
