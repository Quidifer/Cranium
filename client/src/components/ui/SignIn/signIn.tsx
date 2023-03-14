import React, { useState } from "react";
import "./signIn.css";
import cranium from "../../../resources/cranium.svg";
import standingCrane from "../../../resources/standingCrane.svg";

interface Props {
  updateScreenState: () => void;
}

export default function SignIn(props: Props) {
  const { updateScreenState } = props;
  const [name, setName] = useState("");
  return (
    <div
      style={{
        minHeight: "100%",
        minWidth: "100%",
      }}
    >
      <div
        style={{
          height: "100%",
          width: "55%",
          position: "fixed",
          left: "0",
          top: "0",
          overflowX: "hidden",
          backgroundColor: "#828282",
        }}
      >
        <div className="standingCrane">
          <img
            src={standingCrane}
            style={{
              height: "90%",
              width: "50vw",
              marginLeft: "5vw",
              marginRight: "5vw",
            }}
            alt="standingCrane"
          />
          <table className="SignInTable">
            <tr className="TableRow">
              <th className="TableElement">Elegance</th>
              <th className="TableElement">Graceful</th>
              <th className="TableElement">Magnificent</th>
              <th className="TableElement">Serendipitous</th>
              <th className="TableElement">Chic</th>
            </tr>
            <tr className="TableRow">
              <th className="TableElement">Excellence</th>
              <th className="TableElement">Gallant</th>
              <th className="TableElement">Master-Class</th>
              <th className="TableElement">Spectacular</th>
              <th className="TableElement">Cool</th>
            </tr>
            <tr className="TableRow">
              <th className="TableElement">Exquisite</th>
              <th className="TableElement">Grandiose</th>
              <th className="TableElement">Marvelous</th>
              <th className="TableElement">Sophisticated</th>
              <th className="TableElement">Clean</th>
            </tr>
          </table>
        </div>
      </div>
      <div
        style={{
          right: "0",
          height: "100%",
          width: "45%",
          position: "fixed",
          top: "0",
          overflowX: "hidden",
          alignItems: "center",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            marginTop: "100px",
            alignItems: "center",
            marginLeft: "auto",
            marginRight: "auto",
            display: "flex",
          }}
        >
          <img src={cranium} alt="Cranium" className="Cranium"></img>
        </div>
        <div
          style={{
            height: "200px",
            width: "60%",
            marginTop: "8vh",
            marginLeft: "auto",
            marginRight: "auto",
            alignItems: "center",
            display: "grid",
          }}
        >
          <div className="form__group field">
            <input
              type="input"
              className="form__field"
              placeholder="Name"
              name="name"
              id="name"
              required
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
            <label htmlFor="name" className="form__label">
              Name
            </label>
          </div>
          <div
            style={{
              height: "50px",
              width: "240px",
              marginLeft: "auto",
              marginRight: "auto",
              alignItems: "center",
              display: "flex",
            }}
          >
            <button
              onClick={() => {
                updateScreenState();
                console.log(name);
              }}
            >
              <label className="ButtonFont">Sign In</label>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
