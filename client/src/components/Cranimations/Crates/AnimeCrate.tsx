import React, { useState, useRef, useMemo } from "react";
import { CSSTransition } from "react-transition-group";
import "./AnimeCrates.css";

interface Props {
  scale: number;
  tileHeight: number;
  widthScale: number;
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
  const { scale, tileHeight, widthScale } = props;

  const boxRef = useRef() as React.MutableRefObject<HTMLInputElement>;
  const ropeRef = useRef() as React.MutableRefObject<HTMLInputElement>;
  const excessRopeRef = useRef() as React.MutableRefObject<HTMLInputElement>;

  const start: coord = useMemo(() => {
    return { row: 0, col: 7, type: "buffer" };
  }, []);
  const end: coord = useMemo(() => {
    return { row: 0, col: 0, type: "truck" };
  }, []);
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
  const shipLeft = 738;
  const truckLeft = 613; //not done
  const craneTop = 169.5;
  const shipTop = 454.5;
  const bufferTop = 403.7;
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
        Math.max(start.row, end.row) * tileHeight;
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
    const height =
      start.type === "truck"
        ? truckTop - top
        : (start.type === "ship" ? shipTop : bufferTop) -
          top -
          start.row * tileHeight;

    return {
      height: scale * height,
      width: scale * width,
      top: scale * top,
      left: scale * left,
    };
  }, [left, scale, start.row, start.type, tileHeight, top, width]);

  const crateBoundingBoxFinal: box = useMemo(() => {
    const height =
      end.type === "truck"
        ? truckTop - top
        : (end.type === "ship" ? shipTop : bufferTop) -
          top -
          end.row * tileHeight;

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

  const classBoxStages = ["crate0", "crate1", "crate2"];
  const classRopeStages = ["rope0", "rope1", "rope2"];

  const [_animate, setAnimate] = useState(false);
  const animate: boolean = useMemo(() => {
    if ((index === 0 || index === 2) && currBoundingBox.height === 0) {
      setIndex((index + 1) % 3);
      return false;
    } else {
      return _animate;
    }
  }, [_animate, currBoundingBox.height, index]);

  setTimeout(() => {
    setAnimate(true);
  }, 1000);

  return (
    <>
      <CSSTransition
        in={animate}
        classNames={moveType + classBoxStages[index]}
        timeout={2150}
        nodeRef={boxRef}
        onEntered={() => {
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
            className={moveType + classBoxStages[index]}
            ref={boxRef}
            style={{
              height: `${scale * tileHeight + 10}px`,
              width: `${scale * (tileHeight * widthScale)}px`,
              ...boxStages[index],
            }}
          >
            <div
              style={{
                position: "absolute",
                backgroundColor: "black",
                top: 0,
                bottom: `${scale * 10}px`,
                width: `${scale * 3}px`,
                height: `${scale * 10}px`,
              }}
            />
            <div
              className="crate"
              style={{
                height: `${scale * (tileHeight - 1)}px`,
                width: `${scale * (tileHeight * widthScale - 2)}px`,
                bottom: 1,
                borderRadius: `${scale * 1}px`,
                border: `${scale * 1}px solid black`,
              }}
            >
              <p style={{ fontSize: `${scale * 0.35}rem` }}>{"Crate"}</p>
            </div>
          </div>
        </div>
      </CSSTransition>
      <CSSTransition
        in={animate}
        classNames={moveType + classRopeStages[index]}
        timeout={2150}
        nodeRef={ropeRef}
        // onEntering={() => {
        //   if ((index === 0 || index === 2) && currBoundingBox.height === 0)
        //     setIndex(index + 1);
        // }}
      >
        <div
          style={{
            position: "absolute",
            height: `${currBoundingBox.height}px`,
            width: `${currBoundingBox.width}px`,
            top: `${currBoundingBox.top}px`,
            left: `${currBoundingBox.left + scale * 8}px`,
          }}
        >
          <div
            className={moveType + classRopeStages[index]}
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
        classNames={`${moveType}excessRope`}
        timeout={2150}
        nodeRef={excessRopeRef}
      >
        <div
          style={{
            position: "absolute",
            height: `${currBoundingBox.top - (craneTop - 2) * scale}px`,
            width: `${currBoundingBox.width}px`,
            top: `${craneTop * scale}px`,
            left: `${currBoundingBox.left + scale * 8}px`,
          }}
        >
          <div
            className={`${moveType}excessRope`}
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
              backgroundColor: "black",
            }}
          />
        </div>
      </CSSTransition>
    </>
  );
}
