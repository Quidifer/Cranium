import { v4 } from "uuid";
import { Offload, Onload, Ship, ShipContainer, Buffer } from "./ShipContainer";
import { CraneMove } from "./CraneMove";

export default class EngineNode {

    public isInitialState = false;
    public depth = 0;
    public cost = Infinity;
    public previousNode: EngineNode | undefined;

    readonly id: string;
    readonly state: Ship;
    readonly onloads: Array<Onload>;
    readonly offloads: Array<Offload>;
    readonly move: CraneMove | undefined;
    readonly buffer: Buffer;
    readonly minutes: number;

    constructor(state: Ship, buffer: Buffer, onloads: Array<Onload>, offloads: Array<Offload>, move?: CraneMove, minutes: number = 0) {
        this.id = v4(); // Probably change this to name
        this.state = state;
        this.buffer = buffer;
        this.onloads = onloads;
        this.offloads = offloads;
        this.move = move;
        this.minutes = minutes;
    }

    public bufferIsEmpty() {
        return this.buffer.every(row => row.every(container => container === null));
    }
};