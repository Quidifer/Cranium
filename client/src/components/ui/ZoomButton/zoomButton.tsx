import "./zoomButtonStyles.css";
import React, { useState } from "react";

interface Props {
  onPlus: () => void;
  onMinus: () => void;
}

export default function ZoomButton(props: Props) {
  const { onPlus, onMinus } = props;

  const [plusBackground, setPlusBackground] = useState("#666");
  const [minusBackground, setMinusBackground] = useState("#666");

  return (
    <div className="ZoomDiv">
      <button
        className="zoomInOutButtons"
        style={{ backgroundColor: plusBackground }}
        className="zoomButton"
        onClick={() => onPlus()}
        onMouseOver={() => setPlusBackground("#999")}
        onMouseLeave={() => setPlusBackground("#666")}
      >
        +
      </button>
      <button
        className="zoomInOutButtons"
        style={{ backgroundColor: minusBackground }}
        className="zoomButton"
        onClick={() => onMinus()}
        onMouseOver={() => setMinusBackground("#999")}
        onMouseLeave={() => setMinusBackground("#666")}
      >
        -
      </button>
    </div>
  );
}
