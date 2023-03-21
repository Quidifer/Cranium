import React, { useState, useCallback } from "react";
import Cranimations from "../../Cranimations/Cranimations";

import InteractableBox from "../InteractableBox/interactableBox";
import submitButton from "../../../resources/SubmitButton.svg";
import Loading from "../../../resources/loadingballs.gif";
import "./crateMovement.css";

interface Props {
  prevScreenState: (type: string) => void;
  setManifest: any;
  manifest: any;
  setBuffer: any;
  buffer: any;
  moveSet: {
    row_start: number;
    col_start: number;
    row_end: number;
    col_end: number;
    move_type: string;
    container_name: string;
    container_weight: number;
  }[];
}

export default function CrateMovement(props: Props) {
  const { moveSet, manifest, setManifest, buffer, setBuffer } = props;

  const [items, setItems] = useState(() => {
    let items = [];
    items.push({
      row_start: -1,
      col_start: -1,
      row_end: -1,
      col_end: -1,
      move_type: "invis",
      container_name: "invis",
      container_weight: -1,
    });
    items.push(...moveSet);
    items.push({
      row_start: -1,
      col_start: -1,
      row_end: -1,
      col_end: -1,
      move_type: "invis",
      container_name: "invis",
      container_weight: -1,
    });
    return items;
  });

  const [animateBoxes, setAnimateBoxes] = useState(false);

  const updateItems = useCallback(() => {
    setItems(items.slice(1, items.length));
    setAnimateBoxes(false);
  }, [items, setAnimateBoxes]);

  const [currentStep, setCurrentStep] = useState(0);
  const [isGhost, setIsGhost] = useState(true);

  const [comment, setComment] = useState("");

  return (
    <div className="page">
      <div className="leftcontent">
        <div className="header"></div>
        <div className="crane">
          <Cranimations
            movementProps={{
              moveSet: props.moveSet,
              currentStep: currentStep,
              isGhost: isGhost,
              finishedMoved: () => {
                setIsGhost(true);
                setCurrentStep(currentStep + 1);

                const move = moveSet[currentStep];
                setManifest(() => {
                  switch (move.move_type) {
                    case "SHIP_MOVE":
                    case "ONLOAD":
                    case "BUFFER_TO_SHIP":
                      manifest[
                        (move.row_end - 1) * 12 + (move.col_end - 1)
                      ].name = move.container_name;
                      manifest[
                        (move.row_end - 1) * 12 + (move.col_end - 1)
                      ].weight = move.container_weight;
                      break;
                  }
                  return manifest;
                });
                setBuffer(() => {
                  switch (move.move_type) {
                    case "BUFFER_MOVE":
                    case "SHIP_TO_BUFFER":
                      buffer[(move.row_end - 1) * 4 + (move.col_end - 1)].name =
                        move.container_name;
                      buffer[
                        (move.row_end - 1) * 4 + (move.col_end - 1)
                      ].weight = move.container_weight;
                      break;
                  }
                  return buffer;
                });

                console.log(manifest, buffer);
              },
            }}
            {...props}
          />
        </div>
        <div className="footer">
          <div className="CommentTitle">Add Comment</div>
          <div className="CommentBar">
            <textarea
              className="CommentInput"
              placeholder="Type here..."
              name="comment"
              id="comment"
              onChange={(e) => {
                setComment(e.target.value);
              }}
            ></textarea>
            <button className="SubmitComment">
              <img
                src={submitButton}
                style={{
                  height: "150%",
                  width: "150%",
                  marginLeft: "-25%",
                  marginTop: "-25%",
                }}
                alt="submit"
                className="ButtonSvg"
              />
            </button>
          </div>
        </div>
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
              setAnimateBoxes(true);
              setIsGhost(false);
              const move = moveSet[currentStep];
              setManifest(() => {
                switch (move.move_type) {
                  case "SHIP_MOVE":
                  case "OFFLOAD":
                  case "SHIP_TO_BUFFER":
                    manifest[
                      (move.row_start - 1) * 12 + (move.col_start - 1)
                    ].name = "UNUSED";
                    manifest[
                      (move.row_start - 1) * 12 + (move.col_start - 1)
                    ].weight = 0;
                    break;
                }

                return manifest;
              });

              setBuffer(() => {
                switch (move.move_type) {
                  case "BUFFER_MOVE":
                  case "BUFFER_TO_SHIP":
                    buffer[
                      (move.row_start - 1) * 4 + (move.col_start - 1)
                    ].name = "UNUSED";
                    buffer[
                      (move.row_start - 1) * 4 + (move.col_start - 1)
                    ].weight = 0;
                    break;
                }
                return buffer;
              });
            }}
            disabled={!isGhost || currentStep >= moveSet.length}
          >
            {isGhost ? (
              <label>Next</label>
            ) : (
              <img
                style={{
                  width: "50px",
                }}
                src={Loading}
                alt="Loading"
              />
            )}
          </button>
        </div>
        <div className="gradient" />
        <div className="gradient1" />
        <div className="gradient2" />
      </div>
    </div>
  );
}
