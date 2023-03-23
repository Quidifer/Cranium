import React, { useState, useRef, useMemo, useCallback } from "react";
import { CSSTransition } from "react-transition-group";
import { Tile } from "./Tile";
import { hashedCrateClass } from "../utility";
import { FrontEndContainer } from "../../../types/APISolution";

import "./AnimeCrates.css";
import "./Tile.css";

interface Props {
  scale: number;
  tileHeight: number;
  widthScale: number;
  manifest: FrontEndContainer[];
  buffer: FrontEndContainer[];
  movementProps: {
    moveSet: {
      row_start: number;
      col_start: number;
      row_end: number;
      col_end: number;
      move_type: string;
      container_name: string;
      container_weight: number;
    }[];
    currentStep: number;
    isGhost: boolean;
    finishedMoved: () => void;
  };
}

interface box {
  height: number;
  width: number;
  top: number;
  left: number;
}

interface coord {
  row: number;
  col: number;
  type: "ship" | "buffer" | "truck";
}

export default function AnimeCrate(props: Props) {
  const { manifest, buffer, scale, tileHeight, widthScale, movementProps } =
    props;
  const { moveSet, currentStep, isGhost, finishedMoved } = movementProps;

  const ghost: string = useMemo(() => (isGhost ? "ghost" : ""), [isGhost]);

  const boxRef = useRef() as React.MutableRefObject<HTMLInputElement>;
  const ropeRef = useRef() as React.MutableRefObject<HTMLInputElement>;
  const excessRopeRef = useRef() as React.MutableRefObject<HTMLInputElement>;

  const move = moveSet[currentStep];

  const start: coord = useMemo(() => {
    let type: "ship" | "buffer" | "truck";
    switch (move.move_type) {
      case "OFFLOAD":
      case "SHIP_MOVE":
      case "SHIP_TO_BUFFER":
        type = "ship";
        break;
      case "ONLOAD":
        type = "truck";
        break;
      case "BUFFER_MOVE":
      case "BUFFER_TO_SHIP":
        type = "buffer";
        break;
      default:
        type = "buffer";
        break;
    }
    return { row: move.row_start - 1, col: move.col_start - 1, type };
  }, [move.col_start, move.move_type, move.row_start]);
  const end: coord = useMemo(() => {
    let type: "ship" | "buffer" | "truck";
    switch (move.move_type) {
      case "ONLOAD":
      case "SHIP_MOVE":
      case "BUFFER_TO_SHIP":
        type = "ship";
        break;
      case "OFFLOAD":
        type = "truck";
        break;
      case "BUFFER_MOVE":
      case "SHIP_TO_BUFFER":
        type = "buffer";
        break;
      default:
        type = "buffer";
        break;
    }

    return { row: move.row_end - 1, col: move.col_end - 1, type };
  }, [move.col_end, move.move_type, move.row_end]);

  const moveType: "left" | "right" = useMemo(() => {
    if (start.type !== end.type) {
      if (start.type === "buffer") return "right";
      else if (end.type === "buffer") return "left";
      else if (start.type === "truck") return "right";
      else return "left";
    } else {
      return start.col < end.col ? "right" : "left";
    }
  }, [end.col, end.type, start.col, start.type]);
  const leftCoord = useMemo(() => {
    return moveType === "left" ? end : start;
  }, [moveType, start, end]);
  const rightCoord = useMemo(() => {
    return moveType === "left" ? start : end;
  }, [moveType, end, start]);

  const highestRow = useMemo(() => {
    if (leftCoord.type !== rightCoord.type) return -1;
    let best = Math.max(leftCoord.row, rightCoord.row);
    for (let col = leftCoord.col + 1; col < rightCoord.col; ++col) {
      for (let row = leftCoord.type === "ship" ? 7 : 3; row >= best; --row) {
        const name: string =
          leftCoord.type === "ship"
            ? manifest[row * 12 + col].name
            : buffer[row * 24 + col].name;
        if (name !== "UNUSED" && name !== "NAN") {
          best = row + 1;
          break;
        }
      }
    }
    console.log("best", best, leftCoord.type, leftCoord.row, rightCoord.row);
    return best;
  }, [
    buffer,
    leftCoord.col,
    leftCoord.row,
    leftCoord.type,
    manifest,
    rightCoord.col,
    rightCoord.row,
    rightCoord.type,
  ]);

  // useCallback(() => {
  //   updateManifest(manifest, start, end, moveSet[currStep]);
  // }, [end, manifest, moveSet, start]);

  const [index, setIndex] = useState(0);

  const boxStages: React.CSSProperties[] =
    moveType === "left"
      ? [
          {
            top: "100%",
            left: "100%",
          },
          {
            left: "100%",
          },
          {
            top: "0%",
          },
        ]
      : [
          {
            top: "100%",
          },
          {
            left: "0%",
          },
          {
            top: "0%",
            left: "100%",
          },
        ];

  const ropeStages: React.CSSProperties[] =
    moveType === "left"
      ? [
          {
            height: "100%",
            left: "100%",
          },
          {
            left: "100%",
          },
          {
            height: 0,
          },
        ]
      : [
          {
            height: "100%",
          },
          {
            left: "0%",
          },
          {
            left: "100%",
            height: "0%",
          },
        ];

  const bufferLeft = 118;
  const shipLeft = 736;
  const truckLeft = 650; //not done
  const craneTop = 169.5;
  const shipTop = 423.3;
  const bufferTop = 410;
  const truckTop = 398; // not done

  const tileWidth = tileHeight * widthScale;

  //these values stay constant between the initial and final bounding box
  const top =
    start.type !== end.type
      ? craneTop
      : (start.type === "ship"
          ? shipTop
          : start.type === "buffer"
          ? bufferTop
          : truckTop) -
        highestRow * tileHeight; // this is bugged
  const left =
    (leftCoord.type === "buffer"
      ? bufferLeft
      : leftCoord.type === "ship"
      ? shipLeft
      : truckLeft) +
    leftCoord.col * tileWidth;
  const width =
    (rightCoord.type === "ship"
      ? shipLeft
      : rightCoord.type === "buffer"
      ? bufferLeft
      : truckLeft) -
    left +
    rightCoord.col * tileWidth;

  const crateBoundingBoxInit: box = useMemo(() => {
    let height =
      start.type === "truck"
        ? truckTop - top
        : (start.type === "ship" ? shipTop : bufferTop) -
          top -
          start.row * tileHeight;
    if (height < 1e-5) height = 0;

    return {
      height: scale * height,
      width: scale * width,
      top: scale * top,
      left: scale * left,
    };
  }, [left, scale, start.row, start.type, tileHeight, top, width]);

  const crateBoundingBoxFinal: box = useMemo(() => {
    let height =
      end.type === "truck"
        ? truckTop - top
        : (end.type === "ship" ? shipTop : bufferTop) -
          top -
          end.row * tileHeight;
    if (height < 1e-5) height = 0;

    return {
      height: scale * height,
      width: scale * width,
      top: scale * top,
      left: scale * left,
    };
  }, [end.row, end.type, left, scale, tileHeight, top, width]);

  const currBoundingBox: box = useMemo(() => {
    return index <= 1 ? crateBoundingBoxInit : crateBoundingBoxFinal;
  }, [crateBoundingBoxFinal, crateBoundingBoxInit, index]);

  console.log(currBoundingBox.height);

  const classBoxStages = ["crate0", "crate1", "crate2"];
  const classRopeStages = ["rope0", "rope1", "rope2"];

  const [_animate, setAnimate] = useState(false);
  const animate: boolean = useMemo(() => {
    if ((index === 0 || index === 2) && currBoundingBox.height === 0) {
      if (index === 2 && !isGhost) {
        finishedMoved();
      }
      setIndex((index + 1) % 3);
      return false;
    } else {
      return _animate;
    }
  }, [_animate, currBoundingBox.height, finishedMoved, index, isGhost]);

  setTimeout(() => {
    setAnimate(true);
  }, 1000);

  return (
    <>
      <CSSTransition
        in={animate}
        classNames={ghost + moveType + classBoxStages[index]}
        timeout={isGhost ? 1150 : 2150}
        nodeRef={boxRef}
        onEntered={() => {
          // if the animation is real
          if (!isGhost && index === 2) {
            console.log("fukcasjkcdjaskl");
            finishedMoved();
          }
          setIndex((index + 1) % 3);
          setAnimate(false);
          setTimeout(() => {
            setAnimate(true);
          }, 10);
        }}
      >
        <div
          style={{
            position: "absolute",
            height: `${currBoundingBox.height}px`,
            width: `${currBoundingBox.width}px`,
            top: `${currBoundingBox.top}px`,
            left: `${currBoundingBox.left}px`,
          }}
        >
          <div
            className={ghost + moveType + classBoxStages[index]}
            ref={boxRef}
            style={{
              height: `${scale * (tileHeight + 5)}px`,
              width: `${scale * (tileHeight * widthScale)}px`,
              ...boxStages[index],
            }}
          >
            <div
              style={{
                position: "absolute",
                backgroundColor: isGhost ? "rgb(100, 100, 100)" : "black",
                bottom: `${scale * 29}px`,
                width: `${scale * 3}px`,
                height: `${scale * 5}px`,
              }}
            />
            <div
              className={
                isGhost ? "ghost" : hashedCrateClass(move.container_name)
              }
              style={{
                height: `${scale * (tileHeight - 1)}px`,
                width: `${scale * (tileHeight * widthScale - 1)}px`,
                borderRadius: `${scale * 1}px`,
                border: `${scale * 0.8}px solid rgb(46, 46, 46)`,
                position: "absolute",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <p
                style={{
                  overflow: "hidden",
                  maxWidth: `${scale * (tileHeight * widthScale)}px`,
                  fontSize: `${scale * 0.35}rem`,
                }}
              >
                {move.container_name}
              </p>
            </div>
          </div>
        </div>
      </CSSTransition>
      <CSSTransition
        in={animate}
        classNames={ghost + moveType + classRopeStages[index]}
        timeout={isGhost ? 1150 : 2150}
        nodeRef={ropeRef}
      >
        <div
          style={{
            position: "absolute",
            height: `${currBoundingBox.height}px`,
            width: `${currBoundingBox.width}px`,
            top: `${currBoundingBox.top}px`,
            left: `${currBoundingBox.left + scale * 7.75}px`,
          }}
        >
          <div
            className={ghost + moveType + classRopeStages[index]}
            ref={ropeRef}
            style={{
              width: `${scale * 3}px`,
              ...ropeStages[index],
            }}
          ></div>
        </div>
      </CSSTransition>
      <CSSTransition
        in={animate && index === 1}
        classNames={ghost + moveType + "excessRope"}
        timeout={isGhost ? 1150 : 2150}
        nodeRef={excessRopeRef}
      >
        <div
          style={{
            position: "absolute",
            height: `${currBoundingBox.top - (craneTop - 2) * scale}px`,
            width: `${currBoundingBox.width}px`,
            top: `${craneTop * scale}px`,
            left: `${currBoundingBox.left + scale * 7.75}px`,
          }}
        >
          <div
            className={ghost + moveType + "excessRope"}
            ref={excessRopeRef}
            style={{
              position: "absolute",
              height: "100%",
              left:
                moveType === "left"
                  ? index <= 1
                    ? "100%"
                    : "0%"
                  : index <= 1
                  ? "0%"
                  : "100%",
              width: `${scale * 3}px`,
              backgroundColor: isGhost ? "rgb(100, 100, 100)" : "black",
            }}
          />
        </div>
      </CSSTransition>
    </>
  );
}
