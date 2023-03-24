import React, { useState, useEffect } from "react";
import { FrontEndContainer } from "../../types/APISolution";

interface Props {
  onloadContainers: FrontEndContainer[];
  setOnloadContainers: React.Dispatch<
    React.SetStateAction<FrontEndContainer[]>
  >;
  scale: number;
}

export default function OnloadInput(props: Props) {
  const { onloadContainers, setOnloadContainers, scale } = props;

  useEffect(() => {
    (document.getElementById("onload") as HTMLFormElement)?.reset();
  });

  const saveOnload = () => {
    const name = (document.getElementById("name") as HTMLInputElement).value;
    const weight = parseFloat(
      (document.getElementById("weight") as HTMLInputElement).value
    );

    setOnloadContainers([
      ...onloadContainers,
      { name: name, weight: weight, row: -1, col: -1 },
    ]);
  };

  return (
    <div
      style={{
        position: "relative",
        border: `solid ${1.5 * scale}px`,
        backgroundColor: "white",
        borderRadius: `${10 * scale}px`,
        height: `${156 * scale}px`,
        width: `${250 * scale}px`,
      }}
    >
      <p
        style={{
          fontSize: `${13 * scale}px`,
          fontWeight: "bold",
          textAlign: "center",
          paddingTop: `${11 * scale}px`,
        }}
      >
        Enter information of
      </p>
      <p
        style={{
          fontSize: `${13 * scale}px`,
          fontWeight: "bold",
          textAlign: "center",
        }}
      >
        container to onload
      </p>
      <div
        style={{
          position: "absolute",
          fontSize: `${13 * scale}px`,
          left: `${15 * scale}px`,
          top: `${51 * scale}px`,
        }}
      >
        <form id="onload" action="" method="get" className="form-example">
          <div className="form-example">
            <label
              htmlFor="name"
              style={{
                position: "absolute",
                left: `${0 * scale}`,
                top: `${6 * scale}px`,
              }}
            >
              Name:{" "}
            </label>
            <input
              type="text"
              name="name"
              id="name"
              required
              style={{
                position: "absolute",
                left: `${58 * scale}px`,
                top: `${3 * scale}px`,
                padding: `${3 * scale}px`,
                margin: `${3 * scale}px`,
                height: `${10 * scale}px`,
                width: `${145 * scale}px`,
                fontSize: `${14 * scale}px`,
                fontFamily: "work sans",
              }}
            />
          </div>
          <div className="form-example">
            <label
              htmlFor="weight"
              style={{
                position: "absolute",
                left: `${0 * scale}px`,
                top: `${30 * scale}px`,
              }}
            >
              Weight:{" "}
            </label>
            <input
              type="number"
              name="weight"
              id="weight"
              required
              style={{
                position: "absolute",
                left: `${58 * scale}px`,
                top: `${26 * scale}px`,
                padding: `${3 * scale}px`,
                margin: `${3 * scale}px`,
                height: `${10 * scale}px`,
                width: `${145 * scale}px`,
                fontSize: `${14 * scale}px`,
                fontFamily: "work sans",
              }}
            />
          </div>
        </form>
      </div>

      <button
        type="submit"
        onClick={saveOnload}
        className="onloadButton"
        style={{
          position: "absolute",
          border: "none",
          width: `${100 * scale}px`,
          height: `${30 * scale}px`,
          left: `${75 * scale}px`,
          top: `${111 * scale}px`,
          fontSize: `${13 * scale}px`,
          borderRadius: `${200 * scale}px`,
        }}
      >
        Add
      </button>
    </div>
  );
}
