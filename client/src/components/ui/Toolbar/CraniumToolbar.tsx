import ColorPallet from "../../../utils/ColorPallet";
import CraniumButton from "../CraniumButton/CraniumButton";
import ViewManifest from "../ViewButton/viewManifest";
import ViewLog from "../ViewButton/viewLog";
import { FrontEndContainer } from "../../../types/APISolution";
import API from "../../../utils/API";
import "./CraniumToolbar.css";

interface Props {
  manifest: FrontEndContainer[];
  manifestName: string;
  updateScreenState: () => void;
  updatePrevScreenState: () => void;
  goToSignIn: () => void;
  fromLoad?: boolean;
  onloads?: FrontEndContainer[];
  offloads?: FrontEndContainer[];
}

export default function CraniumToolbar(props: Props) {
  const {
    manifest,
    manifestName,
    updateScreenState,
    updatePrevScreenState,
    goToSignIn,
    fromLoad,
    onloads,
    offloads,
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
          onClick={() => {
            if (fromLoad) {
              if (onloads && offloads)
                API.sendJob("TRANSFER", manifest, onloads, offloads);
            }
            updateScreenState();
          }}
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
