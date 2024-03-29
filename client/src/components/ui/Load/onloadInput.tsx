import React, { useState, useEffect } from "react";

interface Props {
  setOnloadContainers: any;
  onloadContainers: any;
  scale: any;
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
    debugger;
    setOnloadContainers([
      ...onloadContainers,
      { name: name, weight: weight, row: -1, col: -1 },
    ]);
  };

  return (
    <div
      style={{
        position: "relative",
        border: "solid",
        backgroundColor: "white",
        height: `${150 * scale}px`,
        width: `${250 * scale}px`,
      }}
    >
      <p
        style={{
          fontSize: `${13 * scale}px`,
          fontWeight: "bold",
          textAlign: "center",
          paddingTop: "5px",
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
          top: `${48 * scale}px`,
        }}
      >
        <form id="onload" action="" method="get" className="form-example">
          <div className="form-example">
            <label
              htmlFor="name"
              style={{
                position: "absolute",
                left: `${0 * scale}`,
                top: `${3 * scale}px`,
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
                top: `${0 * scale}px`,
                padding: `${3 * scale}px`,
                margin: `${3 * scale}px`,
                height: `${10 * scale}px`,
                width: `${145 * scale}px`,
              }}
            />
          </div>
          <div className="form-example">
            <label
              htmlFor="weight"
              style={{
                position: "absolute",
                left: `${0 * scale}px`,
                top: `${27 * scale}px`,
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
                top: `${23 * scale}px`,
                padding: `${3 * scale}px`,
                margin: `${3 * scale}px`,
                height: `${10 * scale}px`,
                width: `${145 * scale}px`,
              }}
            />
          </div>
        </form>
      </div>

      <button
        type="submit"
        onClick={saveOnload}
        style={{
          position: "absolute",
          width: `${100 * scale}px`,
          height: `${30 * scale}px`,
          left: `${75 * scale}px`,
          top: `${108 * scale}px`,
          fontSize: `${13 * scale}px`,
        }}
      >
        Add
      </button>
    </div>
  );
}
