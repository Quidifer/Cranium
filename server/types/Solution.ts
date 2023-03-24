import { CraneMove } from "./CraneMove";
import { MoveSet } from "./MoveSet";
import { FrontEndManifest, Ship } from "./ShipContainer";

export type Solution = {
    solved: boolean;
    moves?: Array<CraneMove>;
    final_manifest?: FrontEndManifest;
}