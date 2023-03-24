import { ContainerArea } from "./ContainerLocation";

export type FrontEndContainer = {
    name: string,
    weight: number,
    row: number,
    col: number
};

export type FrontEndManifest = Array<FrontEndContainer>;

export type ShipContainer = {
    name: string;
    weight: number;
    row: number,
    col: number,
    location: ContainerArea;
}

export type Location = {
    row: number,
    col: number
};

export type Onload = {
    name: string;
    weight: number;
}

export type Offload = FrontEndContainer;

export type Ship = Array<Array<ShipContainer | null | undefined>>;
export type Buffer = Array<Array<ShipContainer | null>>;