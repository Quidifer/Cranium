export type FrontEndContainer = {
  name: string;
  weight: number;
  row: number;
  col: number;
};

export type FrontEndManifest = Array<FrontEndContainer>;

export type CraneMove = {
  step?: number;
  row_start: number;
  row_end: number;
  col_start: number;
  col_end: number;
  move_type: CraneMoveType;
  container_name: string;
  weight: number;
  manifest: FrontEndManifest;
  buffer: FrontEndManifest;
  minutesLeft: number;
};

export enum CraneMoveType {
  OFFLOAD = "OFFLOAD",
  ONLOAD = "ONLOAD",
  SHIP_MOVE = "SHIP_MOVE",
  BUFFER_MOVE = "BUFFER_MOVE",
  SHIP_TO_BUFFER = "SHIP_TO_BUFFER",
  BUFFER_TO_SHIP = "BUFFER_TO_SHIP",
  DUMMY = "",
}

export type APISolution = {
  username: string;
  moves: CraneMove[];
  index: number;
  final_manifest: FrontEndManifest;
};
