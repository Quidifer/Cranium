import React, { useState, useRef, useMemo } from "react";
import { CSSTransition } from "react-transition-group";
import "./interactableBox.css";

interface Props {
  info?: string;
  index: number;
  greenBox?: boolean;
  animationStart: boolean;
  setAnimationStart: React.Dispatch<React.SetStateAction<boolean>>;
  updateItems: () => void;
}

export default function InteractableBox(props: Props) {
  const {
    info,
    index,
    greenBox,
    animationStart,
    setAnimationStart,
    updateItems,
  } = props;

  //   props.ref = useRef(null);
  const nodeRef = useRef() as React.MutableRefObject<HTMLInputElement>;

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
            <div className={animationType} ref={nodeRef}>
              <div style={{ height: "30px" }}></div>
              <p className="info">{info}</p>
            </div>
          </CSSTransition>
        </div>
      ) : (
        <CSSTransition
          in={animationStart}
          classNames={animationType}
          timeout={2000}
          nodeRef={nodeRef}
          key={index}
          // onEnter={() => setRenderBoxes(false)}
          onEntered={() => {
            setAnimationStart(false);
            updateItems();
          }}
        >
          <div className={index === 0 ? "destroy" : "move"} ref={nodeRef}>
            <div style={{ height: "30px" }}></div>
            <p className="info">{info}</p>
          </div>
        </CSSTransition>
      )}
    </>
    // <CSSTransition
    //   in={moveBox}
    //   classNames="box"
    //   timeout={300}
    //   nodeRef={nodeRef}
    //   key={index}
    //   // onEnter={() => setRenderBoxes(false)}
    //   onEntered={() => setRenderBoxes(false)}
    // >
    //   {index === 1 ? (
    //     <div className="GreenBox" ref={nodeRef}>
    //       <div className="box">
    //         <div style={{ height: "30px" }}></div>
    //         <p className="info">{info}</p>
    //       </div>
    //     </div>
    //   ) : (
    //     <div className="box" ref={nodeRef}>
    //       <div style={{ height: "30px" }}></div>
    //       <p className="info">{info}</p>
    //     </div>
    //   )}
    // </CSSTransition>
  );
}
