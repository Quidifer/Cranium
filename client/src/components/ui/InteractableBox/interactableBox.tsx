import React, { useState, useRef, useMemo } from "react";
import { CSSTransition } from "react-transition-group";
import "./interactableBox.css";

interface Props {
  info: {
    row_start: number;
    col_start: number;
    row_end: number;
    col_end: number;
    move_type: string;
    container_name: string;
    container_weight: number;
  };
  index: number;
  greenBox?: boolean;
  animationStart: boolean;
  setAnimationStart: React.Dispatch<React.SetStateAction<boolean>>;
  updateItems: () => void;
}

export default function InteractableBox(props: Props) {
  const { index, greenBox, animationStart, setAnimationStart, updateItems } =
    props;

  let { info } = props;

  const nodeRef = useRef() as React.MutableRefObject<HTMLInputElement>;

  function truncate(input: string) {
    const maxWidth = 15;
    if (input.length > maxWidth) {
      return input.substring(0, maxWidth) + "...";
    }
    return input;
  }

  const container_name = truncate(info.container_name.slice());

  function setSourceDest() {
    let source: string;
    let dest: string;
    switch (info.move_type) {
      case "SHIP_MOVE":
        source = "SHIP";
        dest = "SHIP";
        break;
      case "BUFFER_MOVE":
        source = "BUFFER";
        dest = "BUFFER";
        break;
      case "SHIP_TO_BUFFER":
        source = "SHIP";
        dest = "BUFFER";
        break;
      case "BUFFER_TO_SHIP":
        source = "BUFFER";
        dest = "SHIP";
        break;
      case "OFFLOAD":
        source = "SHIP";
        dest = "UNREACHABLE";
        break;
      case "ONLOAD":
        source = "UNREACHABLE";
        dest = "SHIP";
        break;
      default:
        source = "INVIS";
        dest = "INVIS";
        break;
    }
    return [source, dest];
  }

  const [source_name, dest_name] = setSourceDest();

  const animationType =
    index === 0
      ? "destroy"
      : greenBox && index && index <= 2
      ? "moveFar"
      : "move";

  return (
    <>
      {greenBox && index === 1 ? (
        <div className="GreenBox">
          <CSSTransition
            in={animationStart}
            classNames={animationType}
            timeout={2000}
            nodeRef={nodeRef}
            key={index}
            onEntered={() => {
              setAnimationStart(false);
              updateItems();
            }}
          >
            {source_name === "INVIS" ? (
              <div className="invisible" ref={nodeRef} />
            ) : (
              <div className={animationType} ref={nodeRef}>
                <p style={{ position: "absolute" }} className="boxHead">
                  {info.move_type !== "OFFLOAD" && info.move_type !== "ONLOAD"
                    ? "MOVE"
                    : info.move_type}
                </p>
                <div className="infoContent">
                  <p className="info">
                    <b>Crate</b>: '{container_name}' {info.container_weight} kg
                  </p>
                  <p className="info">
                    <b>Source</b>:{" "}
                    {info.move_type === "ONLOAD" ? (
                      <>TRUCK</>
                    ) : (
                      <>
                        {source_name} [{info.row_start}, {info.col_start}]
                      </>
                    )}
                  </p>
                  <p className="info">
                    <b>Destination</b>:{" "}
                    {info.move_type === "OFFLOAD" ? (
                      <>TRUCK</>
                    ) : (
                      <>
                        {dest_name} [{info.row_end}, {info.col_end}]
                      </>
                    )}
                  </p>
                </div>
              </div>
            )}
          </CSSTransition>
        </div>
      ) : (
        <CSSTransition
          in={animationStart}
          classNames={animationType}
          timeout={2000}
          nodeRef={nodeRef}
          key={index}
          onEntered={() => {
            setAnimationStart(false);
            updateItems();
          }}
        >
          {source_name === "INVIS" ? (
            <div className="invisible" ref={nodeRef} />
          ) : (
            <div className={animationType} ref={nodeRef}>
              <p style={{ position: "absolute" }} className="boxHead">
                {info.move_type !== "OFFLOAD" && info.move_type !== "ONLOAD"
                  ? "MOVE"
                  : info.move_type}
              </p>
              <div className="infoContent">
                <p className="info">
                  <b>Crate</b>: '{container_name}' {info.container_weight} kg
                </p>
                <p className="info">
                  <b>Source</b>:{" "}
                  {info.move_type === "ONLOAD" ? (
                    <>TRUCK</>
                  ) : (
                    <>
                      {source_name} [{info.row_start}, {info.col_start}]
                    </>
                  )}
                </p>
                <p className="info">
                  <b>Destination</b>:{" "}
                  {info.move_type === "OFFLOAD" ? (
                    <>TRUCK</>
                  ) : (
                    <>
                      {dest_name} [{info.row_end}, {info.col_end}]
                    </>
                  )}
                </p>
              </div>
            </div>
          )}
        </CSSTransition>
      )}
    </>
  );
}
