import { timeout } from "q";
import React, { useState, useEffect } from "react";
import Popup from "reactjs-popup";
import "./popupReminder.css";
import API from "../../../utils/API";

interface Props {
  func: () => void;
  columnFinish?: boolean;
  isFinished: () => boolean;
}

export default function PopupRemider(props: Props) {
  const { func, columnFinish } = props;
  const [open, setOpen] = useState(false);
  const closeModal = () => setOpen(false);
  return (
    <>
      <button
        className={columnFinish ? "finishColumnButton" : "finishButton"}
        onClick={() => {if (props.isFinished()) setOpen((o) => !o)}}
      >
        Finish
      </button>
      <Popup open={open} closeOnDocumentClick onClose={closeModal}>
        <div className="popup">
          <div className="popupContent">
            <p>
              Please make sure you have sent the outbound manifest to the ship's
              captain before you exit.{" "}
            </p>
            <br />
            <p>Do you want to exit?</p>
          </div>
          <button className="yesButton" onClick={func}>
            Yes
          </button>
          <button className="noButton" onClick={closeModal}>
            No
          </button>
        </div>
      </Popup>
    </>
  );
}
