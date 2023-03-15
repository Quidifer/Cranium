import React, { useState, useEffect } from "react";

interface Props {
  setOnloadContainers: any;
  onloadContainers: any;
}

export default function OnloadInput(props: Props) {
  const { onloadContainers, setOnloadContainers } = props;

  useEffect(() => {
    (document.getElementById("onload") as HTMLFormElement)?.reset();
  })

  const saveOnload = () => {
    const name = (document.getElementById("name") as HTMLInputElement).value;
    const weight = parseFloat((document.getElementById("weight") as HTMLInputElement).value);

    setOnloadContainers([...onloadContainers, { name: name, weight: weight }]);
  };

  return (
    <>
      <div style={{ fontSize: "15px", fontWeight: "bold" }}>
        Enter information of container to onload
      </div>
      <form id="onload" action="" method="get" className="form-example">
        <div className="form-example">
          <label htmlFor="name">Name: </label>
          <input type="text" name="name" id="name" required />
        </div>
        <div className="form-example">
          <label htmlFor="weight">Weight: </label>
          <input type="number" name="weight" id="weight" required />
        </div>
      </form>
      <button
        type="submit"
        // form="onload"
        style={{ width: "100px", height: "30px" }}
        onClick={saveOnload}
      >
        Add
      </button>
    </>
  );
}
