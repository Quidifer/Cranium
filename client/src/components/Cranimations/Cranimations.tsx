import "./Cranimations.css";
import React, { useState, useRef, useCallback } from "react";
import { CSSTransition } from "react-transition-group";
import Draggable from "react-draggable";
import ZoomButton from "../ui/ZoomButton/zoomButton";
import AnimeCrate from "./Crates/AnimeCrate";
import Crane from "./Crane";
import Eye from "../../resources/eye.png";
import CrossedEye from "../../resources/crossedeye.png";
import Water from "../../resources/ocean.gif";
import Shark from "../../resources/shark.gif";
import Truck from "../../resources/truck.svg";
import Fog from "../../resources/fog.png";
import background0 from "../../resources/background0.png";
import background1 from "../../resources/background1.png";
import background2 from "../../resources/background2.png";
import background3 from "../../resources/background3.png";
import Boat from "../../resources/boat.png";
import Smoke from "../../resources/smoke.gif";
import Cloud1 from "../../resources/clouds/cloud1.png";
import Cloud2 from "../../resources/clouds/cloud2.png";
import Cloud3 from "../../resources/clouds/cloud3.png";
import Cloud4 from "../../resources/clouds/cloud4.png";
import Cloud5 from "../../resources/clouds/cloud5.png";
import Cloud6 from "../../resources/clouds/cloud6.png";
import Birdy from "../../resources/lilbirdy.gif";
import { Tile } from "./Crates/Tile";
import { FrontEndContainer, APISolution } from "../../types/APISolution";

interface Props {
  manifest: FrontEndContainer[];
  setManifest: React.Dispatch<React.SetStateAction<FrontEndContainer[]>>;
  buffer: FrontEndContainer[];
  setBuffer: React.Dispatch<React.SetStateAction<FrontEndContainer[]>>;
  movementProps: {
    moveSet: APISolution;
    currentStep: number;
    isGhost: boolean;
    finishedMoved: () => void;
  };
}

export default function Craninmations(props: Props) {
  const HEIGHT = 500;
  const WIDTH = 1000;
  const { manifest, buffer, movementProps } = props;
  const { moveSet, currentStep } = movementProps;

  // make sure the current step is indexible
  const move =
    currentStep < moveSet.moves.length
      ? moveSet.moves[currentStep]
      : {
          row_start: -1,
          col_start: -1,
          row_end: -1,
          col_end: -1,
          move_type: "",
          container_name: "",
          container_weight: -1,
        };

  const [contentHeight, setContentHeight] = useState(HEIGHT);
  const [contentWidth, setContentWidth] = useState(WIDTH);
  const [scale, setScale] = useState(1.0);
  const [vision, setVision] = useState(true);

  const nodeRef = useRef() as React.MutableRefObject<HTMLInputElement>;
  const fogRef = useRef() as React.MutableRefObject<HTMLInputElement>;

  const isInList = (list: FrontEndContainer[], row: number, col: number) => {
    return list.some((item) => item.row === row && item.col === col);
  };

  const widthScale = 17 / 25;
  const tileHeight = 27.15;

  const createBoard = (n: number, m: number) => {
    const isManifest = n === 8 && m === 12 ? true : false;
    const isBuffer = n === 4 && m === 24 ? true : false;

    let sameSource = false;
    let sameDest = false;
    switch (move.move_type) {
      case "OFFLOAD":
        sameSource = isManifest;
        break;
      case "SHIP_MOVE":
        sameSource = isManifest;
        sameDest = isManifest;
        break;
      case "SHIP_TO_BUFFER":
        sameSource = isManifest;
        sameDest = isBuffer;
        break;
      case "ONLOAD":
        sameDest = isManifest;
        break;
      case "BUFFER_MOVE":
        sameSource = isBuffer;
        sameDest = isBuffer;
        break;
      case "BUFFER_TO_SHIP":
        sameSource = isBuffer;
        sameDest = isManifest;
        break;
    }

    const board = [];
    for (let row = n; row >= 1; row--) {
      const boardRow = [];
      for (let col = 1; col <= m; col++) {
        let color = "normal";
        const cell = isManifest
          ? manifest.find((item) => item.row === row && item.col === col)
          : isBuffer
          ? buffer.find((item) => item.row === row && item.col === col)
          : "";
        let name = cell ? cell.name : "";
        if (
          (isManifest && isInList(manifest, row, col)) ||
          (isBuffer && isInList(buffer, row, col))
        ) {
          if (name === "NAN") {
            name = "";
            color = "nan";
          } else if (name === "UNUSED") {
            name = "";
          }
        }

        boardRow.push(
          <Tile
            color={color}
            id={`${col - 1},${row - 1}`}
            name={name}
            scale={scale}
            tileHeight={tileHeight}
            widthScale={widthScale}
            source={
              sameSource && move.col_start === col && move.row_start === row
            }
            dest={sameDest && move.col_end === col && move.row_end === row}
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
  const _buffer = createBoard(4, 24);

  const [animate, setAnimate] = useState(false);
  setTimeout(() => {
    setAnimate(true);
  }, 1000);

  return (
    <>
      <div
        style={{
          position: "absolute",
          height: "55px",
          width: "70px",
          zIndex: 10,
        }}
      >
        <button
          style={{
            position: "absolute",
            height: "40px",
            width: "40px",
            borderRadius: "20px",
            backgroundColor: "transparent",
            border: "none",
            right: 0,
            bottom: 0,
          }}
          onClick={() => {
            setVision(!vision);
          }}
        >
          <img
            style={{
              position: "absolute",
              height: "50px",
              right: 0,
              bottom: "0px",
            }}
            src={vision ? Eye : CrossedEye}
            alt="toggle view"
          />
        </button>
      </div>
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
          overflowY: "auto",
          overflowX: "auto",
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
              className="DraggingClassCrate"
              ref={nodeRef}
              style={{
                height: `${contentHeight}px`,
                width: `${contentWidth}px`,
                display: "block",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                backgroundColor: "#BEF5FF",
                boxShadow: "rgba(0, 0, 0, 0.1) 0px 0px 20px 15px",
              }}
            >
              {vision && (
                <>
                  <img
                    style={{
                      position: "absolute",
                      height: `${330 * scale}px`,
                      bottom: `${-20 * scale}px`,
                      left: `${-220 * scale}px`,
                    }}
                    src={background0}
                    alt=""
                  />
                  <div
                    style={{
                      position: "absolute",
                      height: `${50 * scale}px`,
                      width: `${100 * scale}px`,
                      bottom: `${240 * scale}px`,
                      left: `${230 * scale}px`,
                    }}
                  >
                    <img
                      className="cloudshort"
                      style={{
                        position: "absolute",
                        height: `${50 * scale}px`,
                        left: 0,
                      }}
                      src={Cloud1}
                      alt=""
                    />
                  </div>
                  <img
                    style={{
                      position: "absolute",
                      height: `${390 * scale}px`,
                      bottom: `${-20 * scale}px`,
                      left: `${-80 * scale}px`,
                    }}
                    src={background1}
                    alt=""
                  />
                  <div
                    style={{
                      position: "absolute",
                      height: `${40 * scale}px`,
                      width: `${100 * scale}px`,
                      bottom: `${200 * scale}px`,
                      left: `${650 * scale}px`,
                    }}
                  >
                    <img
                      className="cloudshort"
                      style={{
                        position: "absolute",
                        height: `${60 * scale}px`,
                        left: 0,
                      }}
                      src={Cloud3}
                      alt=""
                    />
                  </div>
                  <img
                    style={{
                      position: "absolute",
                      height: `${300 * scale}px`,
                      bottom: `${-25 * scale}px`,
                      left: `${400 * scale}px`,
                    }}
                    src={background2}
                    alt=""
                  />
                  <img
                    style={{
                      position: "absolute",
                      height: `${7 * scale}px`,
                      bottom: `${200 * scale}px`,
                      left: `${580 * scale}px`,
                    }}
                    src={Birdy}
                    alt=""
                  />
                  <img
                    style={{
                      position: "absolute",
                      height: `${7 * scale}px`,
                      bottom: `${280 * scale}px`,
                      left: `${345 * scale}px`,
                      transform: "rotate(30deg)",
                    }}
                    src={Birdy}
                    alt=""
                  />
                  <img
                    style={{
                      position: "absolute",
                      height: `${7 * scale}px`,
                      bottom: `${235 * scale}px`,
                      left: `${130 * scale}px`,
                      transform: "rotate(45deg)",
                    }}
                    src={Birdy}
                    alt=""
                  />
                  <img
                    style={{
                      position: "absolute",
                      height: `${7 * scale}px`,
                      bottom: `${235 * scale}px`,
                      left: `${40 * scale}px`,
                    }}
                    src={Birdy}
                    alt=""
                  />
                  <img
                    style={{
                      position: "absolute",
                      height: `${8 * scale}px`,
                      bottom: `${280 * scale}px`,
                      left: `${750 * scale}px`,
                      transform: "rotate(-30deg)",
                    }}
                    src={Birdy}
                    alt=""
                  />
                  <img
                    style={{
                      position: "absolute",
                      height: `${9 * scale}px`,
                      bottom: `${390 * scale}px`,
                      left: `${900 * scale}px`,
                      transform: "rotate(30deg)",
                    }}
                    src={Birdy}
                    alt=""
                  />
                  <img
                    style={{
                      position: "absolute",
                      height: `${9 * scale}px`,
                      bottom: `${420 * scale}px`,
                      left: `${100 * scale}px`,
                      transform: "rotate(-20deg)",
                    }}
                    src={Birdy}
                    alt=""
                  />
                  <div
                    style={{
                      position: "absolute",
                      height: `${40 * scale}px`,
                      width: `${670 * scale}px`,
                      bottom: `${150 * scale}px`,
                      left: `${10 * scale}px`,
                    }}
                  >
                    <img
                      className="cloudlong"
                      style={{
                        position: "absolute",
                        height: `${30 * scale}px`,
                        left: 0,
                      }}
                      src={Cloud5}
                      alt=""
                    />
                  </div>
                  <img
                    style={{
                      position: "absolute",
                      height: `${395 * scale}px`,
                      bottom: `${-130 * scale}px`,
                      left: `${-180 * scale}px`,
                    }}
                    src={background3}
                    alt=""
                  />
                  <div
                    style={{
                      position: "absolute",
                      height: `${40 * scale}px`,
                      width: `${450 * scale}px`,
                      bottom: `${180 * scale}px`,
                      left: `${10 * scale}px`,
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        height: `${40 * scale}px`,
                        width: `${670 * scale}px`,
                        bottom: `${100 * scale}px`,
                        left: `${10 * scale}px`,
                      }}
                    >
                      <img
                        className="cloudlong"
                        style={{
                          position: "absolute",
                          height: `${30 * scale}px`,
                          left: 0,
                        }}
                        src={Cloud4}
                        alt=""
                      />
                    </div>
                    <div
                      style={{
                        position: "absolute",
                        height: `${40 * scale}px`,
                        width: `${600 * scale}px`,
                        bottom: `${190 * scale}px`,
                        left: `${100 * scale}px`,
                      }}
                    >
                      <img
                        className="cloudlong"
                        style={{
                          position: "absolute",
                          height: `${30 * scale}px`,
                          left: 0,
                        }}
                        src={Cloud6}
                        alt=""
                      />
                    </div>
                    <img
                      className="cloudlong"
                      style={{
                        position: "absolute",
                        height: `${30 * scale}px`,
                        left: 0,
                      }}
                      src={Cloud2}
                      alt=""
                    />
                  </div>
                  <img
                    style={{
                      position: "absolute",
                      height: `${100 * scale}px`,
                      bottom: `${317 * scale}px`,
                      left: `${732 * scale}px`,
                    }}
                    src={Smoke}
                    alt=""
                  />
                  <div
                    style={{
                      position: "absolute",
                      height: `${50 * scale}px`,
                      width: `${150 * scale}px`,
                      bottom: `${200 * scale}px`,
                      left: `${200 * scale}px`,
                    }}
                  >
                    <img
                      className="cloudshort"
                      style={{
                        position: "absolute",
                        height: `${50 * scale}px`,
                        left: 0,
                      }}
                      src={Cloud3}
                      alt=""
                    />
                  </div>
                  <CSSTransition
                    in={animate}
                    classNames="fog"
                    timeout={60000}
                    nodeRef={fogRef}
                    onEntered={() => {
                      setAnimate(false);
                      setTimeout(() => {
                        setAnimate(true);
                      }, 1000);
                    }}
                  >
                    <div
                      ref={fogRef}
                      className="fog"
                      style={{
                        position: "absolute",
                        height: "100%",
                        width: "100%",
                        left: "-100%",
                      }}
                    >
                      <img
                        style={{
                          position: "absolute",
                          height: `${600 * scale}px`,
                          bottom: `${100 * scale}px`,
                          left: `${0 * scale}px`,
                        }}
                        src={Fog}
                        alt="Fog"
                      />
                    </div>
                  </CSSTransition>
                </>
              )}
              <img
                style={{
                  position: "absolute",
                  height: `${480 * scale}px`,
                  bottom: `${-111 * scale}px`,
                  left: `${653 * scale}px`,
                }}
                src={Boat}
                alt=""
              />
              {vision && (
                <img
                  style={{
                    position: "absolute",
                    width: `${30 * scale}px`,
                    bottom: `${10 * scale}px`,
                    left: `${705 * scale}px`,
                  }}
                  src={Shark}
                  alt="Shark"
                />
              )}
              <div
                style={{
                  position: "absolute",
                  left: `${733.1 * scale}px`,
                  top: `${233 * scale}px`,
                }}
              >
                {board}
              </div>
              <div
                style={{
                  position: "absolute",
                  left: `${115 * scale}px`,
                  bottom: `${57 * scale}px`,
                }}
              >
                {_buffer}
              </div>
              <Crane height={`${550 * scale}px`} width={`${1100 * scale}px`} />
              {props.movementProps.currentStep <
                props.movementProps.moveSet.moves.length && (
                <>
                  {props.movementProps.isGhost ? (
                    <AnimeCrate
                      key={"gay"}
                      scale={scale}
                      tileHeight={tileHeight}
                      widthScale={widthScale}
                      {...props}
                    />
                  ) : (
                    <AnimeCrate
                      key={"not gay"}
                      scale={scale}
                      tileHeight={tileHeight}
                      widthScale={widthScale}
                      {...props}
                    />
                  )}
                </>
              )}

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
                  width: `${300 * scale}px`,
                  bottom: `${-89 * scale}px`,
                  left: `${700 * scale}px`,
                }}
                src={Water}
                alt="Ocean"
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
              {(move.move_type === "OFFLOAD" ||
                move.move_type === "ONLOAD") && (
                <div
                  style={{
                    position: "absolute",
                    height: `${50 * scale}px`,
                    width: `${36.3 * scale}px`,
                    bottom: `${54 * scale}px`,
                    left: `${602 * scale}px`,
                    border: `${2 * scale}px dashed ${
                      move.move_type === "ONLOAD" ? "rgb(5, 245, 5)" : "red"
                    }`,
                    borderRadius: `${scale * 5}px`,
                    zIndex: 10,
                  }}
                />
              )}
              <div
                style={{
                  position: "absolute",
                  height: `${contentHeight}px`,
                  width: `${contentWidth}px`,
                  backgroundColor: "transparent",
                }}
              />
            </div>
          </Draggable>
        </div>
      </div>
    </>
  );
}
