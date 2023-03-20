import "./Cranimations.css";
import React, { useState, useRef, useMemo } from "react";
import Draggable from "react-draggable";
import ZoomButton from "./zoomButton";
import AnimeCrate from "./Crates/AnimeCrate";
import Crane from "./Crane";
import ShipOutline from "../../resources/shipoutline.svg";
import Truck from "../../resources/truck.svg";
import { Tile } from "./Crates/Tile";

interface Props {
  setManifest: any;
  manifest: any;
}

export default function Craninmations(props: Props) {
  const HEIGHT = 500;
  const WIDTH = 1000;
  const { setManifest, manifest } = props;

  const [contentHeight, setContentHeight] = useState(HEIGHT);
  const [contentWidth, setContentWidth] = useState(WIDTH);
  const [scale, setScale] = useState(1.0);

  const nodeRef = useRef() as React.MutableRefObject<HTMLInputElement>;

  const isInList = (list: any, row: any, col: any) => {
    return list.some((item: any) => item.row === row && item.col === col);
  };

  const widthScale = 17 / 25;
  const tileHeight = 28;

  const boardWidth = useMemo(() => {
    const tileWidth = scale * tileHeight * widthScale;
    const borderWidth = 3 * scale * 2;
    return borderWidth + 12 * (tileWidth + 1) + 1;
  }, [scale, widthScale]);

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
          if (name === "NAN") color = "nan";
          else color = "unselected";
        } else {
          color = "nan";
        }

        boardRow.push(
          <Tile
            color={color}
            id={`${col - 1},${row - 1}`}
            name={name}
            scale={scale}
            tileHeight={tileHeight}
            widthScale={widthScale}
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
          border: `${3 * scale}px solid white`,
        }}
      >
        {board}
      </div>
    );
  };

  const board = createBoard(8, 12);
  const buffer = createBoard(4, 24);

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
          overflowY: "scroll",
          overflowX: "scroll",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${contentWidth}px`,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Draggable nodeRef={nodeRef}>
            <div
              ref={nodeRef}
              style={{
                height: `${contentHeight}px`,
                width: `${contentWidth}px`,
                display: "block",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                backgroundColor: "#BEF5FF",
              }}
            >
              <img
                style={{
                  position: "absolute",
                  height: `${72 * scale + boardWidth}px`,
                  bottom: `${-58 * scale}px`,
                  left: `${655 * scale}px`,
                }}
                src={ShipOutline}
                alt="shipoutline"
              />
              <div
                style={{
                  position: "absolute",
                  left: `${735 * scale}px`,
                  bottom: `${10 * scale}px`,
                }}
              >
                {board}
              </div>
              <div
                style={{
                  position: "absolute",
                  left: `${115 * scale}px`,
                  bottom: `${60 * scale}px`,
                }}
              >
                {buffer}
              </div>
              <AnimeCrate
                scale={scale}
                tileHeight={tileHeight}
                widthScale={widthScale}
              />
              <Crane height={`${550 * scale}px`} width={`${1100 * scale}px`} />
              <div
                className="ground"
                style={{
                  position: "absolute",
                  height: `${60 * scale}px`,
                  width: `${700 * scale}px`,
                  bottom: 0,
                }}
              />
              <img
                style={{
                  position: "absolute",
                  height: `${90 * scale}px`,
                  bottom: `${35 * scale}px`,
                  left: `${580 * scale}px`,
                }}
                src={Truck}
                alt="truck"
              />
            </div>
          </Draggable>
        </div>
      </div>
    </>
  );
}
