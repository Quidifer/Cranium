import React, { useState, useCallback } from "react";
import Cranimations from "../../Cranimations/Cranimations";

import InteractableBox from "../InteractableBox/interactableBox";
import submitButton from "../../../resources/SubmitButton.svg";
import Loading from "../../../resources/loadingballs.gif";
import CraniumToolbar from "../Toolbar/CraniumToolbar";

import API from "../../../utils/API";

import { FrontEndContainer } from "../../../types/APISolution";
import "./crateMovement.css";
import {
  APISolution,
  CraneMove,
  CraneMoveType,
} from "../../../types/APISolution";
import API from "../../../utils/API";

interface Props {
  updateScreenState: () => void;
  updatePrevScreenState: () => void;
  goToSignIn: () => void;
  manifestName: string;
  manifest: FrontEndContainer[];
  setManifest: React.Dispatch<React.SetStateAction<FrontEndContainer[]>>;
  buffer: FrontEndContainer[];
  setBuffer: React.Dispatch<React.SetStateAction<FrontEndContainer[]>>;
  moveSet: APISolution;
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
}

export default function CrateMovement(props: Props) {
  const {
    moveSet,
    manifest,
    setManifest,
    buffer,
    setBuffer,
    manifestName,
    updatePrevScreenState,
    updateScreenState,
    goToSignIn,
    currentStep,
    setCurrentStep,
  } = props;

  const [items, setItems] = useState<CraneMove[]>(() => {
    let items = [];
    items.push({
      row_start: -1,
      row_end: -1,
      col_start: -1,
      col_end: -1,
      move_type: CraneMoveType.DUMMY,
      container_name: "invis",
      weight: -1,
      manifest: [],
      buffer: [],
      minutesLeft: -1,
    });
    items.push(...moveSet.moves.slice(currentStep));
    items.push({
      row_start: -1,
      row_end: -1,
      col_start: -1,
      col_end: -1,
      move_type: CraneMoveType.DUMMY,
      container_name: "invis",
      weight: -1,
      manifest: [],
      buffer: [],
      minutesLeft: -1,
    });
    return items;
  });

  const [animateBoxes, setAnimateBoxes] = useState(false);

  const updateItems = useCallback(() => {
    setItems(items.slice(1, items.length));
    setAnimateBoxes(false);
  }, [items, setAnimateBoxes]);

  const [isGhost, setIsGhost] = useState(true);

  const [comment, setComment] = useState("");

  return (
    <div className="page">
      <div className="leftcontent">
        <div className="header">
          <CraniumToolbar
            manifest={manifest}
            manifestName={manifestName}
            updateScreenState={updateScreenState}
            updatePrevScreenState={updatePrevScreenState}
            goToSignIn={goToSignIn}
          />
        </div>
        <div className="crane">
          <Cranimations
            movementProps={{
              moveSet: props.moveSet,
              currentStep: currentStep,
              isGhost: isGhost,
              finishedMoved: () => {
                setIsGhost(true);
                setAnimateBoxes(true);
                setCurrentStep(currentStep + 1);
                if (currentStep < moveSet.moves.length - 1) {
                  setManifest(moveSet.moves[currentStep + 1].manifest);
                  setBuffer(moveSet.moves[currentStep + 1].buffer);
                }
              },
            }}
            {...props}
          />
        </div>
        <div className="footer">
          <div className="CommentTitle">{/* Add Comment */}</div>
          <div className="CommentBar">
            <textarea
              className="CommentInput"
              placeholder="Add comment..."
              name="comment"
              id="comment"
              onChange={(e) => {
                setComment(e.target.value);
              }}
            ></textarea>
            <button
              className="SubmitComment"
              onClick={() => {
                API.sendLog(comment, "NONE");
              }}
            >
              <img
                src={submitButton}
                style={{
                  height: "125%",
                  width: "125%",
                  marginLeft: "-25%",
                  marginTop: "0%",
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
              setIsGhost(false);

              API.nextMove();

              const move = moveSet.moves[currentStep];

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
            disabled={!isGhost || currentStep >= moveSet.moves.length}
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
