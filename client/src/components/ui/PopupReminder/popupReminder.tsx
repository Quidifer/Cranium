import { timeout } from "q";
import React, { useState, useEffect } from "react";
import Popup from "reactjs-popup";
import "./popupReminder.css";
import API from "../../../utils/API";

interface Props {
  updateScreenState: () => void;
}

export default function PopupRemider(props: Props) {
  const { updateScreenState } = props;
  const [open, setOpen] = useState(false);
  const closeModal = () => setOpen(false);
  return (
    <>
      <button className="finishButton" onClick={() => setOpen((o) => !o)}>
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
          <button className="yesButton" onClick={updateScreenState}>
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