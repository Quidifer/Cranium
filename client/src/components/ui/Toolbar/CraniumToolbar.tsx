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
  updatePrevScreenState: (type: string) => void;
  goToSignIn: () => void;
}

export default function CraniumToolbar(props: Props) {
  const { manifest, manifestName, updateScreenState, updatePrevScreenState, goToSignIn } = props;
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
        
      </div>
      <h1 className="manifestHeaderBlock">
        {manifestName}
      </h1>
      <div>
        
        <button className="finishCraniumToolbarButton" onClick={updateScreenState}>Finish</button>
        <button className="returnToSignInButton" onClick={goToSignIn} >
          Sign In
        </button>
      </div>
    </div>
  );
}
