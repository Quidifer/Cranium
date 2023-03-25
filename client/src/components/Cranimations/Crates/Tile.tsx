import "./Tile.css";
import React, { useCallback } from "react";
import { hashedCrateClass } from "../utility";

export function Tile(props: any) {
  const { id, name, scale, tileHeight, widthScale, source, dest } = props;
  let { color } = props;

  color = name !== "" ? hashedCrateClass(name) : color;

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
              : color === "normal"
              ? "1px solid rgba(46, 46, 46, 0.3)"
              : "1px solid rgb(46, 46, 46)",
          borderRadius: name !== "" ? `${scale * 1.6}px` : "",
        }}
      >
        <p
          style={{
            maxWidth: `${scale * (tileHeight * widthScale)}px`,
            fontSize: `${scale * 0.35}rem`,
          }}
        >
          {name}
        </p>
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
            color === "nan" || color === "normal"
              ? `${scale * 0.8}px solid rgba(46, 46, 46, 0.3)`
              : `${scale * 0.8}px solid rgb(46, 46, 46)`,
          borderRadius: name !== "" ? `${scale * 1.6}px` : "",
        }}
      >
        <p
          style={{
            maxWidth: `${scale * (tileHeight * widthScale)}px`,
            fontSize: `${scale * 0.35}rem`,
          }}
        >
          {name}
        </p>
      </div>
      {(source || dest) && (
        <div
          style={{
            position: "absolute",
            height: `${scale * (tileHeight + 1)}px`,
            width: `${scale * (tileHeight * widthScale + 1)}px`,
            border: `${2 * scale}px dashed ${
              source ? "rgb(5, 245, 5)" : "red"
            }`,
            borderRadius: `${scale * 5}px`,
            zIndex: 10,
          }}
        ></div>
      )}
    </div>
  );
}
