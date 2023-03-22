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
  updatePrevScreenState: () => void;
  goToSignIn: () => void;
}

export default function CraniumToolbar(props: Props) {
  const {
    manifest,
    manifestName,
    updateScreenState,
    updatePrevScreenState,
    goToSignIn,
  } = props;
  updatePrevScreenState();
  const height = "50px";
  const width = "100px";

  return (
    <div className="toolbar">
      <div>
        <ViewManifest manifest={manifest} manifestName={manifestName} />
        <ViewLog manifest={manifest} manifestName={manifestName} />
      </div>
      <div>
        
      </div>
      <div>
        
        <button className="finishCraniumToolbarButton" onClick={updateScreenState}>Finish</button>
        <button className="returnToSignInButton" onClick={goToSignIn} >
          Sign In
        </button>
      </div>
    </div>
  );
}
