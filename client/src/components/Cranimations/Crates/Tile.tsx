import "./Tile.css";
import React, { useCallback } from "react";

export function Tile(props: any) {
  const { id, name, scale, tileHeight, widthScale } = props;
  let { color } = props;

  const colors = [
    "lighterBlue",
    "lightBlue",
    "lightYellow",
    "lightRed",
    "green",
  ];

  const hash = useCallback((str: string) => {
    let h1 = 1779033703,
      h2 = 3144134277,
      h3 = 1013904242,
      h4 = 2773480762;
    for (let i = 0, k; i < str.length; i++) {
      k = str.charCodeAt(i);
      h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
      h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
      h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
      h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
    }
    h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067);
    h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
    h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213);
    h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179);
    return Math.abs(h1 ^ h2 ^ h3 ^ h4);
  }, []);

  color = name !== "" ? colors[Math.floor(hash(name) % colors.length)] : color;

  return (
    <div
      style={{
        height: `${scale * tileHeight}px`,
        width: `${scale * (tileHeight * widthScale)}px`,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        id={id}
        style={{
          position: "absolute",
          height: `${scale * tileHeight}px`,
          width: `${scale * (tileHeight * widthScale)}px`,
          display: "flex",
          overflow: "hidden",
          justifyContent: "center",
          alignItems: "center",
          border:
            color === "nan"
              ? "1px solid #2e2e2e"
              : color === "unselected"
              ? "1px solid rgba(46, 46, 46, 0.3)"
              : "1px solid rgb(46, 46, 46)",
          borderRadius: name !== "" ? `${scale * 1.6}px` : "",
        }}
      >
        <p style={{ fontSize: `${scale * 0.5}rem` }}>{name}</p>
      </div>
      <div
        id={id}
        className={color}
        style={{
          position: "absolute",
          height: `${scale * (tileHeight - 1)}px`,
          width: `${scale * (tileHeight * widthScale - 1)}px`,
          display: "flex",
          overflow: "hidden",
          justifyContent: "center",
          alignItems: "center",
          border:
            color === "nan" || color === "unselected"
              ? `${scale * 0.8}px solid rgba(46, 46, 46, 0.3)`
              : `${scale * 0.8}px solid rgb(46, 46, 46)`,
          borderRadius: name !== "" ? `${scale * 1.6}px` : "",
        }}
      >
        <p style={{ fontSize: `${scale * 0.5}rem` }}>{name}</p>
      </div>
      {id === "1,1" && (
        <div
          style={{
            position: "absolute",
            height: `${scale * tileHeight}px`,
            width: `${scale * tileHeight * widthScale}px`,
            border: "4px dashed lightgreen",
            borderRadius: `${scale * 5}px`,
            zIndex: 10,
          }}
        ></div>
      )}
    </div>
  );
}
