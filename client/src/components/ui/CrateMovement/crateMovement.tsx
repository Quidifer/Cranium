import React, { useState, useCallback } from "react";
import Craninmations from "../../Cranimations/Cranimations";

import InteractableBox from "../InteractableBox/interactableBox";
import "./crateMovement.css";

interface Props {
  setManifest: any;
  manifest: any;
  moveSet: {
    row_start: number;
    col_start: number;
    row_end: number;
    col_end: number;
    move_type: string;
    step: number;
  }[];
}

export default function CrateMovement(props: Props) {
  const [items, setItems] = useState([
    "This is a test of a lot of information that is long",
    "test2",
    "test3",
    "test4",
    "test5",
    "test6",
    "test7",
  ]);

  const [animateBoxes, setAnimateBoxes] = useState(false);

  const updateItems = useCallback(() => {
    setItems(items.slice(1, items.length));
    setAnimateBoxes(false);
  }, [items, setAnimateBoxes]);

  return (
    <div className="page">
      <div className="leftcontent">
        <div className="header"></div>
        <div className="crane">
          <Craninmations {...props} />
        </div>
        <div className="footer"></div>
      </div>
      <div className="column">
        <div className="timeEstimates">
          <p>time estimates here</p>
        </div>
        <div className="boxContent scrollbar-hidden">
          {items.map((item, index) => {
            return (
              <InteractableBox
                greenBox
                info={item}
                index={index}
                animationStart={animateBoxes}
                setAnimationStart={setAnimateBoxes}
                updateItems={updateItems}
              />
            );
          })}
        </div>
        <div className="columnFooter">
          <button
            className="nextButton"
            onClick={() => {
              // setItems(items.slice(1, items.length));
              // mutableItems.slice(1, mutableItems.length);
              setAnimateBoxes(true);
              console.log(items);
            }}
          >
            <label>Next</label>
          </button>
        </div>
        <div className="gradient" />
        <div className="gradient1" />
        <div className="gradient2" />
      </div>
    </div>
  );
}
