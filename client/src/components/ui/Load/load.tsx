import React, { useState, useCallback } from "react";
import Loadimations from "../../Loadimations/Loadimations";
import CraniumToolbar from "../Toolbar/CraniumToolbar";
import InteractableBox from "../InteractableBox/loadinteractableBox";

import { CraniumContainer } from "../../../types/CraniumContainer";
import { CraniumCount } from "../../../types/CraniumCount";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";

import "./load.css";

const ONLOAD_OFFSET = 1e5;

interface Props {
  updateScreenState: () => void;
  prevScreenState: (type: string) => void;
  manifestName: string;
  manifest: CraniumContainer[];
  setManifest: React.Dispatch<React.SetStateAction<CraniumContainer[]>>;
}

export default function CrateMovement(props: Props) {
  const [animateBoxes, setAnimateBoxes] = useState(false);
  const { updateScreenState, prevScreenState, manifest, manifestName } = props;

  const [destroyedIndex, setDestroyedIndex] = useState(1e9);

  const [onloadContainers, setOnloadContainers] = useState<CraniumContainer[]>(
    []
  );
  const [selectedCells, setSelectedCells] = useState<CraniumContainer[]>([]);
  const [selectedNames, setSelectedNames] = useState<string[]>([]);
  const [counts, setCounts] = useState<CraniumCount[]>([]);

  const [displayOffload, setDisplayOffload] = useState(true);
  const [displayOnload, setDisplayOnload] = useState(true);

  const [alignment, setAlignment] = useState("both");

  const updateItems = useCallback(() => {
    if (destroyedIndex >= ONLOAD_OFFSET) {
      setOnloadContainers(
        onloadContainers
          .slice(0, destroyedIndex)
          .concat(
            onloadContainers.slice(destroyedIndex + 1, onloadContainers.length)
          )
      );
    } else {
      console.log(counts);
      let name = counts[destroyedIndex]["name"];
      setSelectedCells(selectedCells.filter((item) => item.name !== name));
      setSelectedNames(selectedNames.filter((item) => item !== name));
      setCounts(
        counts
          .slice(0, destroyedIndex)
          .concat(counts.slice(destroyedIndex + 1, counts.length))
      );
    }

    setAnimateBoxes(false);
  }, [
    counts,
    destroyedIndex,
    onloadContainers,
    selectedCells,
    selectedNames,
    setCounts,
    setSelectedNames,
  ]);

  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string
  ) => {
    setAlignment(newAlignment);
  };

  return (
    <div className="page">
      <div className="loadLeftContent">
        <CraniumToolbar
          manifest={manifest}
          manifestName={manifestName}
          updateScreenState={updateScreenState}
        />
        <div className="loadScreen">
          <Loadimations
            {...props}
            selectedCells={selectedCells}
            setSelectedCells={setSelectedCells}
            onloadContainers={onloadContainers}
            setOnloadContainers={setOnloadContainers}
            counts={counts}
            setCounts={setCounts}
            selectedNames={selectedNames}
            setSelectedNames={setSelectedNames}
          />
        </div>
      </div>
      <div className="column">
        <div className="loadBoxContent scrollbar-hidden">
          {displayOffload &&
            counts.map((item, index) => {
              let info = `OFFLOAD '${item.name}' ${
                manifest.find((u) => u.name === item.name)?.weight ?? -1
              } kg Count: ${item.count}`;
              return (
                <InteractableBox
                  info={info}
                  index={index}
                  animationStart={animateBoxes}
                  setAnimationStart={setAnimateBoxes}
                  updateItems={updateItems}
                  destroyedIndex={destroyedIndex}
                  setDestroyedIndex={setDestroyedIndex}
                />
              );
            })}
          {displayOnload &&
            onloadContainers.map((item, index) => {
              let info = 'ONLOAD "' + item.name + '" ' + item.weight;
              return (
                <InteractableBox
                  info={info}
                  index={index + ONLOAD_OFFSET}
                  animationStart={animateBoxes}
                  setAnimationStart={setAnimateBoxes}
                  updateItems={updateItems}
                  destroyedIndex={destroyedIndex}
                  setDestroyedIndex={setDestroyedIndex}
                />
              );
            })}
        </div>
        <div className="columnFooter">
          <ToggleButtonGroup
            // color="primary"
            value={alignment}
            exclusive
            onChange={handleChange}
            aria-label="Platform"
            className="columnButtonGroup"
          >
            <ToggleButton
              value="onload"
              className="columnButtonFirst"
              onClick={() => {
                setDisplayOnload(true);
                setDisplayOffload(false);
              }}
            >
              Onload
            </ToggleButton>
            <ToggleButton
              value="both"
              onClick={() => {
                setDisplayOnload(true);
                setDisplayOffload(true);
              }}
            >
              BOTH
            </ToggleButton>
            <ToggleButton
              value="offload"
              className="columnButtonLast"
              onClick={() => {
                setDisplayOnload(false);
                setDisplayOffload(true);
              }}
            >
              Offload
            </ToggleButton>
          </ToggleButtonGroup>
        </div>
        <div className="loadGradient" />
        <div className="loadGradient" />
        <div className="loadGradient" />
        <div className="loadGradient1" />
        <div className="loadGradient1" />
      </div>
    </div>
  );
}
