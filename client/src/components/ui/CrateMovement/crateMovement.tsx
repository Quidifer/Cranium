import React, { useState, useCallback } from "react";
import Cranimations from "../../Cranimations/Cranimations";

import InteractableBox from "../InteractableBox/interactableBox";
import submitButton from "../../../resources/SubmitButton.png";
import submitButtonActive from "../../../resources/submitButtonActive.png";
import Loading from "../../../resources/loadingboxes.gif";
import CraniumToolbar from "../Toolbar/CraniumToolbar";
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

  const [submitButtonHover, setSubmitButtonHover] = useState(false);
  const [nextButtonHover, setNextButtonHover] = useState(false);

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
            updateScreenState={() => {
              setManifest([]);
              setBuffer([]);
              setCurrentStep(0);
              updateScreenState();
            }}
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
                console.log("finishedMove", currentStep);
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
              value={comment}
              name="comment"
              id="comment"
              onChange={(e) => {
                setComment(e.target.value);
              }}
            ></textarea>
            <button
              className="SubmitComment"
              onClick={() => {
                console.log(comment);
                setComment("");
                API.sendLog(comment, "NONE");
              }}
              onMouseEnter={() => setSubmitButtonHover(true)}
              onMouseLeave={() => setSubmitButtonHover(false)}
            >
              <img
                src={submitButtonHover ? submitButtonActive : submitButton}
                style={{
                  height: "100%",
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
          <p style={{ marginTop: "15px" }}>
            <b>Estimated Time Remaining:</b>{" "}
          </p>
          <p>
            {currentStep < moveSet.moves.length
              ? moveSet.moves[moveSet.moves.length - 1].minutesLeft -
                moveSet.moves[currentStep].minutesLeft
              : 0}{" "}
            minutes{" "}
          </p>
          <p style={{ marginTop: "10px" }}>
            <b>Estimated Time Of Move:</b>{" "}
          </p>
          <p>
            {currentStep < moveSet.moves.length
              ? moveSet.moves[currentStep].minutesLeft -
                (currentStep > 0
                  ? moveSet.moves[currentStep - 1].minutesLeft
                  : 0)
              : 0}{" "}
            minutes{" "}
          </p>
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
            style={{
              backgroundColor:
                !nextButtonHover && isGhost ? "#54b12f" : "#3e9a1a",
            }}
            onClick={() => {
              if (!isGhost) return;
              if (currentStep < moveSet.moves.length) {
                setIsGhost(false);

                API.nextMove();

                const move = moveSet.moves[currentStep];

                console.log("making temp state");

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
              } else {
                setCurrentStep(0);
                setManifest([]);
                setBuffer([]);
                updateScreenState();
              }
            }}
            onMouseEnter={() => setNextButtonHover(true)}
            onMouseLeave={() => setNextButtonHover(false)}
          >
            {currentStep < moveSet.moves.length ? (
              isGhost ? (
                <p>Next</p>
              ) : (
                <img
                  style={{
                    width: "70px",
                    marginTop: "5px",
                  }}
                  src={Loading}
                  alt="Loading"
                />
              )
            ) : (
              <p>Finish</p>
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
