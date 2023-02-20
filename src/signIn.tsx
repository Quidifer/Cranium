import React, { useState } from "react";
import "./signIn.css";

interface Props {
  setScreenState: React.Dispatch<React.SetStateAction<string>>;
}

export default function SignIn(props: Props) {
  const { setScreenState } = props;
  const [name, setName] = useState("");
  // return (
  //   <div className="ContentDiv">
  //     <input
  //       className="SignInInputBox"
  //       type="text"
  //       value={name}
  //       placeholder="Enter Your Name"
  //       onChange={(e) => setName(e.target.value)}
  //     />
  //     <button
  //       className="SignInButton"
  //       style={{
  //         border: "1px",
  //         borderRadius: "10px",
  //         height: "100px",
  //         width: "300px",
  //       }}
  //     >
  //       <p>test</p>
  //     </button>
  //   </div>
  // );
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
          width: "60%",
          position: "fixed",
          top: "0",
          overflowX: "hidden",
          paddingTop: "20px",
        }}
      >
        <p style={{ alignSelf: "center" }}>test</p>
      </div>
      <div
        style={{
          right: "0",
          height: "100%",
          width: "40%",
          position: "fixed",
          top: "0",
          overflowX: "hidden",
          paddingTop: "20px",
        }}
      >
        <p>test2</p>
      </div>
    </div>
  );
}
