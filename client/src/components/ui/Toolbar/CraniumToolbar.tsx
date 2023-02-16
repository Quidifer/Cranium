import ColorPallet from "../../../utils/ColorPallet";
import CraniumButton from "../CraniumButton/CraniumButton";
import "./CraniumToolbar.css";
import ViewManifest from "../ViewManifest/viewManifest";
import ViewLog from "../ViewLog/viewLog";
import { CraniumContainer } from "../../../types/CraniumContainer";

interface Props {
  manifest: CraniumContainer[];
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
        <ViewLog />
        {/* <CraniumToolbar/> */}
      </div>
      <div>
        <button
          className="button"
          style={{ backgroundColor: "green" }}
          onClick={updateScreenState}
        >
          Finish
        </button>
        <CraniumButton height={height} width={width} color={ColorPallet.Red}>
          Sign In
        </CraniumButton>
      </div>
    </div>
  );
}
