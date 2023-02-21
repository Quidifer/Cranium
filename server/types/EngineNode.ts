import { v4 } from "uuid";
import { Ship } from "./Ship";

export default class EngineNode {

    readonly id: string;
    readonly state: Ship;
    readonly depth: number;

    constructor(state: Ship, depth: number) {
        this.id = v4();
        this.state = state;
        this.depth = depth;
    }

    isInitialState = false;
    previousNode: EngineNode | undefined;
    
}