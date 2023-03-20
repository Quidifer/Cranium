import React from "react";
import ColorPallet from "../../../utils/ColorPallet";
import CraniumButton from "../CraniumButton/CraniumButton";
import "./CraniumToolbar.css";
import CraniumLogo from "../../../resources/CraniumLogo.png";
import ViewManifest from "../ViewManifest/viewManifest";
import ViewLog from "../ViewLog/viewLog";

interface Props {
  manifest: any;
  manifestName: string;        
  updateScreenState: () => void;
}

export default function CraniumToolbar(props: Props) {
  const { manifest, manifestName, updateScreenState } = props;
  const height = "50px";
  const width = "100px";

  return (
    <div className="toolbar">
      <div>
        <ViewManifest manifest={manifest} manifestName={manifestName} />
        <ViewLog manifest={manifest} manifestName={manifestName} />
        {/* <CraniumToolbar/> */}
      </div>
      <div>
        {/* <CraniumButton
          height={height}
          width={width}
          color={ColorPallet.LightGreen}
        >
          Finish
        </CraniumButton> */}
        <button className="button" style={{color: "green"}} onClick={updateScreenState}>Finish</button>
        <CraniumButton height={height} width={width} color={ColorPallet.Red}>
          Sign In
        </CraniumButton>
      </div>
    </div>
  );
}
