import React, { useState } from "react";
import "./jobSelect.css";
import JobSelectScreen from "../../../resources/JobSelectBackground.png";

interface Props {
  updateScreenState: (type: string) => void;
}

export default function JobSelect(props: Props) {
  const { updateScreenState } = props;
  const [job, setJob] = useState<string>("");

  return (
    <div
      style={{
        position: "absolute",
        height: "100%",
        width: "100%",
        left: 0,
        top: 0,
        justifyContent: "center",
      }}
    >
      <div className="TopHeader">Choose a Job</div>
      <div
        className="Background"
        style={{
          position: "absolute",
          backgroundImage: `url(${JobSelectScreen})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          width: "100%",
          height: "100%",
          opacity: "15%",
        }}
      ></div>

      <div className="MainContainer">
        <div className="Buttons">
          <button
            className="Load"
            onClick={() => {
              setJob("Load");
            }}
          >
            Load
          </button>
          <button
            className="Balance"
            onClick={() => {
              setJob("Balance");
            }}
          >
            Balance
          </button>
          <div className="ContinueDiv">
            <button
              className="Continue"
              onClick={() => {
                updateScreenState(job);
              }}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
