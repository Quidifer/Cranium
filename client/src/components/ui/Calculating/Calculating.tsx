import Video from "../../../resources/loadingbox.gif";
import "../JobSelect/jobSelect.css";
import { useEffect } from "react";
import API from "../../../utils/API";

interface Props {
  updateScreenState: () => void;
}

export default function Calculating(props: Props) {
  const interval = setInterval(() => {
    console.log("polling backend......");
    API.getSolution().then((_data) => {
      if (_data) {
        props.updateScreenState();
        clearInterval(interval);
      }
    });
  }, 300);
  return (
    <div
      style={{
        display: "flex",
        width: "100vw",
        height: "100vh",
        backgroundColor: "#dfdfdf",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <img
        style={{
          height: "300px",
          marginBottom: "50px",
        }}
        src={Video}
        alt="Loading..."
      />
      <p
        className="TopHeader"
        style={{
          marginLeft: "15px",
          fontSize: "30px",
        }}
      >
        Calculating...
      </p>
    </div>
  );
}
