import "./Loadimations.css";
import React, { useState, useRef } from "react";
import Draggable from "react-draggable";
import ZoomButton from "../ui/ZoomButton/zoomButton";
import { Tile } from "./Tile";

import OnloadInput from "./onloadInput";
import { FrontEndContainer } from "../../types/APISolution";

import { CraniumCount } from "../../types/CraniumCount";

interface Props {
  updateScreenState: () => void;
  manifestName: string;
  manifest: FrontEndContainer[];
  setManifest: React.Dispatch<React.SetStateAction<FrontEndContainer[]>>;
  selectedCells: FrontEndContainer[];
  setSelectedCells: React.Dispatch<React.SetStateAction<FrontEndContainer[]>>;
  onloadContainers: FrontEndContainer[];
  setOnloadContainers: React.Dispatch<
    React.SetStateAction<FrontEndContainer[]>
  >;
  counts: CraniumCount[];
  setCounts: React.Dispatch<React.SetStateAction<CraniumCount[]>>;
  selectedNames: string[];
  setSelectedNames: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function Loadimations(props: Props) {
  const HEIGHT = 600;
  const WIDTH = 1000;
  const {
    manifest,
    selectedCells,
    setSelectedCells,
    onloadContainers,
    setOnloadContainers,
    counts,
    setCounts,
    selectedNames,
    setSelectedNames,
  } = props;

  const [contentHeight, setContentHeight] = useState(HEIGHT);
  const [contentWidth, setContentWidth] = useState(WIDTH);
  const [scale, setScale] = useState(1.0);

  const nodeRef = useRef() as React.MutableRefObject<HTMLInputElement>;

  const [rightClicked, setRightClicked] = useState(false);
  const [selectedCell, setSelectedCell] = useState({
    name: "",
    weight: 0,
    row: 0,
    col: 0,
  });

  const isInList = (list: FrontEndContainer[], row: number, col: number) => {
    return list.some((item) => item.row === row && item.col === col);
  };

  const widthScale = 17 / 25;
  const tileHeight = 62;

  const createBoard = (n: number, m: number) => {
    const board = [];
    for (let row = n; row >= 1; row--) {
      const boardRow = [];
      for (let col = 1; col <= m; col++) {
        let color = "unselected";
        const cell = manifest.find(
          (item) => item.row === row && item.col === col
        );

        const name = cell ? cell.name : "";
        const weight = cell ? cell.weight : 0;
        const count = manifest.filter((item) => item.name === name).length;

        if (isInList(manifest, row, col)) {
          if (isInList(selectedCells, row, col)) color = "selected";
          else if (selectedNames.some((item) => item === name))
            color = "duplicate";
          else if (name === "NAN") color = "nan";
          else if (name === "UNUSED") color = "unused";
          else color = "unselected";
        } else {
          color = "nan";
        }

        boardRow.push(
          <Tile
            key={`${col},${row}`}
            row={row}
            col={col}
            name={name}
            weight={weight}
            count={count}
            color={color}
            scale={scale}
            tileHeight={tileHeight}
            widthScale={widthScale}
            manifest={manifest}
            rightClicked={rightClicked}
            setRightClicked={setRightClicked}
            counts={counts}
            setCounts={setCounts}
            selectedCell={selectedCell}
            setSelectedCell={setSelectedCell}
            selectedCells={selectedCells}
            setSelectedCells={setSelectedCells}
            selectedNames={selectedNames}
            setSelectedNames={setSelectedNames}
          />
        );
      }
      board.push(
        <div key={`${row}`} className="row">
          {boardRow}
        </div>
      );
    }

    return (
      <div
        style={{
          display: "block",
          border: `${3 * scale}px solid transparent`,
        }}
      >
        {board}
      </div>
    );
  };

  const board = createBoard(8, 12);

  const [animate, setAnimate] = useState(false);
  setTimeout(() => {
    setAnimate(true);
  }, 1000);

  return (
    <>
      <ZoomButton
        onPlus={() => {
          if (contentHeight >= 2000) return;
          let _scale = scale + 0.1;
          setContentHeight(HEIGHT * _scale);
          setContentWidth(WIDTH * _scale);
          setScale(_scale);
        }}
        onMinus={() => {
          if (contentHeight <= 100) return;
          let _scale = scale - 0.1;
          setContentHeight(HEIGHT * _scale);
          setContentWidth(WIDTH * _scale);
          setScale(_scale);
        }}
      />
      <div
        style={{
          height: "100%",
          width: "100%",
          overflow: "auto",
          // overflowX: "scroll",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${contentWidth}px`,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            left: "50px",
          }}
        >
          <Draggable nodeRef={nodeRef}>
            <div
              className="LoadingDragScreen"
              ref={nodeRef}
              style={{
                
                height: `${contentHeight}px`,
                width: `${contentWidth}px`,
                display: "block",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                backgroundColor: "white",
                // borderBottom: "2px",
                // borderColor: "#9b9b9b",
                // borderStyle: "ridge",
                boxShadow: "rgba(0, 0, 0, 0.05) 0px 0px 12px 12px",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: `${400 * scale}px`,
                  top: `${50 * scale}px`,
                }}
              >
                {board}
              </div>
              <div
                style={{
                  position: "absolute",
                  left: `${90 * scale}px`,
                  top: `${220 * scale}px`,
                }}
              >
                <OnloadInput
                  onloadContainers={onloadContainers}
                  setOnloadContainers={setOnloadContainers}
                  scale={scale}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {rightClicked && (
                  <Draggable
                    onStart={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <div
                      style={{
                        left: `${350 * scale}px`,
                        top: `${205 * scale}px`,
                        height: `${150 * scale}px`,
                        width: `${270 * scale}px`,
                        backgroundColor: "white",
                        fontSize: `${20 * scale}px`,
                        padding: `${15 * scale}px`,
                        borderStyle: "solid",
                        position: "absolute",
                        overflow: "auto",
                      }}
                    >
                      <button
                        style={{
                          backgroundColor: "rgba(0, 0, 0, 0)",
                          position: "absolute",
                          padding: "0px",
                          height: `${25 * scale}px`,
                          width: `${25 * scale}px`,
                          fontWeight: "bold",
                          fontSize: `${20 * scale}px`,
                          top: "0",
                          left: `calc(100% - ${30 * scale}px)`,
                          border: "none",
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
                          fontSize: `${15 * scale}px`,
                          fontWeight: "bold",
                          padding: `${5 * scale}px 0 ${10 * scale}px 0`,
                        }}
                      >
                        Selected Container Information
                      </div>
                      Name: {selectedCell.name} <br />
                      Weight: {selectedCell.weight} <br />
                      Location: ({selectedCell.row}, {selectedCell.col}) <br />
                      Number of Duplicates:{" "}
                      {`${
                        manifest.filter(
                          (item) => item.name === selectedCell.name
                        ).length
                      }`}{" "}
                      <br />
                    </div>
                  </Draggable>
                )}
              </div>
            </div>
          </Draggable>
        </div>
      </div>
    </>
  );
}
