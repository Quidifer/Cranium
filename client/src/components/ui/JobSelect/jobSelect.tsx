import React, { useState } from "react";
import "./jobSelect.css";
// import JobSelectScreen from "../../../resources/JobSelectBackground.png";
import Crane from "../../../resources/flappingCrane.svg";
import Balance from "../../../resources/balance.gif";
import Truck from "../../../resources/truck.gif";

interface Props {
  updateScreenState: (type: string) => void;
  prevScreenState: (type: string) => void;
}

export default function JobSelect(props: Props) {
  const { updateScreenState } = props;
  const [job, setJob] = useState<string>("");
  return (
    <div
      style={{
        overflow: "hidden",
        position: "absolute",
        height: "100%",
        width: "100%",
        left: 0,
        top: 0,
        justifyContent: "center",
      }}
    >
      <div
        className="Background"
        style={{
          position: "absolute",
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          width: "100%",
          height: "100%",
        }}
      ></div>
      <img
        src={Crane}
        style={{
          position: "absolute",
          height: "100vh",
          left: "calc(50% - 100vh/3)",
          opacity: 0.3,
        }}
        alt=""
      />
      <div className="TopHeader">Choose a Job</div>

      <div className="MainContainer">
        <div className="Buttons">
          <button
            className="Load"
            onClick={() => {
              setJob("Load");
            }}
          >
            <img
              height="80px"
              style={{
                marginTop: "0px",
                marginBottom: "15px",
                marginLeft: "-30px",
              }}
              src={Truck}
              alt={""}
            />
            Load
          </button>
          <button
            className="Balance"
            onClick={() => {
              setJob("Balance");
            }}
          >
            <img
              height="150px"
              style={{ marginTop: "-30px", marginBottom: "-20px" }}
              src={Balance}
              alt={""}
            />
            Balance
          </button>
          <div className="ContinueDiv">
            <button
              disabled={job === ""}
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
