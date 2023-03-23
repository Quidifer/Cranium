import ColorPallet from "../../../utils/ColorPallet";
import CraniumButton from "../CraniumButton/CraniumButton";
import ViewManifest from "../ViewButton/viewManifest";
import ViewLog from "../ViewButton/viewLog";
import { CraniumContainer } from "../../../types/CraniumContainer";
import "./CraniumToolbar.css";

interface Props {
  manifest: CraniumContainer[];
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
        <ViewLog />
      </div>
      <div>
        <button
          className="finishCraniumToolbarButton"
          onClick={updateScreenState}
        >
          Finish
        </button>
        <button className="returnToSignInButton" onClick={goToSignIn}>
          Sign In
        </button>
      </div>
    </div>
  );
}
