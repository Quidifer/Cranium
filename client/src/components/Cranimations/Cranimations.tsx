import "./Cranimations.css";
import React, {
  useState,
  useRef,
  useMemo,
  useEffect,
  useCallback,
} from "react";
import Draggable from "react-draggable";
import ZoomButton from "./zoomButton";

export default function Craninmations() {
  const [contentHeight, setContentHeight] = useState(500);
  const [contentWidth, setContentWidth] = useState(800);
  return (
    <>
      <ZoomButton
        onPlus={() => {
          if (contentHeight >= 2000) return;
          setContentHeight(contentHeight + 50);
          setContentWidth(((contentHeight + 50) * 8) / 5);
        }}
        onMinus={() => {
          if (contentHeight <= 100) return;
          setContentHeight(contentHeight - 50);
          setContentWidth(((contentHeight - 50) * 8) / 5);
        }}
      />
      <div
        style={{
          height: "100%",
          width: "100%",
          overflowY: "scroll",
          overflowX: "scroll",
        }}
      >
        <div
          style={{
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Draggable>
            <div
              style={{
                height: `${contentHeight}px`,
                width: `${contentWidth}px`,
                backgroundColor: "white",
              }}
            ></div>
          </Draggable>
        </div>
      </div>
    </>
  );
}
