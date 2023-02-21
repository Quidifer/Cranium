import { ContainerLocation } from "./ContainerLocation";

type ShipContainer = {
    id: string;
    weight: number;
    metadata: object;
    location: ContainerLocation;
}

export default ShipContainer;