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
          <p
            style={{
              position: "inherit",
              fontSize: "1rem",
              marginLeft: "5vw",
              marginRight: "5vw",
              fontFamily: "Monaco",
              color: "#aaa",
            }}
          >
            dobee doooo beee blah blah i like eatch asdfjklf apples are the best
            lokl why are you dubbing over this!!! You ADD Nothing! Please just
            make content of your own. "Casually Explained just destroyed..."
            gosh shut up.
          </p>
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
