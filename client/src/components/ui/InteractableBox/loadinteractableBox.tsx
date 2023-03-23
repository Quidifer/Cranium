import React, { useState, useRef, useMemo } from "react";
import { CSSTransition } from "react-transition-group";
import "./interactableBox.css";

interface Props {
  info: {
    name: string;
    weight: number;
    count: number;
    type: string;
  };
  index: number;
  greenBox?: boolean;
  animationStart: boolean;
  setAnimationStart: React.Dispatch<React.SetStateAction<boolean>>;
  updateItems: () => void;
  destroyedIndex: number;
  setDestroyedIndex: React.Dispatch<React.SetStateAction<number>>;
}

export default function InteractableBox(props: Props) {
  const {
    info,
    index,
    greenBox,
    animationStart,
    setAnimationStart,
    updateItems,
    destroyedIndex,
    setDestroyedIndex,
  } = props;

  const nodeRef = useRef() as React.MutableRefObject<HTMLInputElement>;

  const animationType =
    index === destroyedIndex
      ? "fastdestroy"
      : index > destroyedIndex
      ? "fastmove"
      : "stationary";

  return (
    <CSSTransition
      in={animationStart}
      classNames={animationType}
      timeout={500}
      nodeRef={nodeRef}
      key={index}
      // onEnter={() => setRenderBoxes(false)}
      onEntered={() => {
        setAnimationStart(false);
        updateItems();
      }}
    >
      <div
        className={index === 0 ? "fastdestroy" : "fastmove"}
        ref={nodeRef}
        style={{ position: "relative" }}
      >
        <button
          style={{
            backgroundColor: "rgba(0, 0, 0, 0)",
            position: "absolute",
            padding: "0px",
            height: "25px",
            width: "25px",
            fontWeight: "bold",
            fontSize: "20px",
            top: "0",
            left: "calc(100% - 30px)",
          }}
          onClick={() => {
            setAnimationStart(true);
            setDestroyedIndex(index);
            // setRightClicked(!rightClicked);
          }}
        >
          x
        </button>
        <p className="boxHead">{info.type}</p>
        <div className="infoContent">
          <p className="info">
            <b>Crate</b>: '{info.name}' {info.weight} kg
          </p>
          {info.count !== -1 ? (
            <p className="info">
              <b>Count</b>: {info.count}
            </p>
          ) : (
            <></>
          )}
        </div>
      </div>
    </CSSTransition>
  );
}
