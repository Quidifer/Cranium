import { ContainerLocation } from "./ContainerLocation"
import ShipContainer from "./ShipContainer"

type CraneMove = {
    step: number;
    container: ShipContainer,
    start: ContainerLocation,
    end: ContainerLocation
}

export type {CraneMove}