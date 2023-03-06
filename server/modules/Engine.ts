import { Service } from "typedi";
import { Ship } from "../types/Ship";
import { MoveSet } from "../types/MoveSet";
import { CraneMove } from "../types/CraneMove";
import EngineNode from "../types/EngineNode";

@Service()
export default class Engine {

    // Double check these numbers
    private readonly COST = {
        LOCAL_MOVE: 1,
        AREA_MOVE: 4,
    }

    // heuristic



    public calculateMoveSet_Transfer(ship: Ship) { // : MoveSet
        let exploredStates: Array<EngineNode> = [];
        let queuedStates: Array<EngineNode> = [];
        let goalStates: Array<EngineNode> = [];

        // Queue initial ship state
        const initialState = new EngineNode(ship, 0);
        initialState.isInitialState = true;
        queuedStates.push(initialState);

        do {

            // Grab next Node and remove from queued set
            const leaf = queuedStates[0];
            queuedStates = queuedStates.filter((value) => value.id != leaf.id);

            if(isGoalState(leaf)) {
                goalStates.push(leaf);

            }
            exploredStates.push(leaf);








        } while(queuedStates.length > 0);



         
    }

    private heuristic(initialState: Ship, currentState: Ship) {
        
    }

    public calculateMoveSet_Balance(ship: Ship) { // : MoveSet
        // implement

         
    }

    private simulateMove(ship: Ship, move: CraneMove) { //:Ship
        // implement
    }

    private determinePossibleMoves(ship: Ship) { // : Array<CraneMove> 
        // implement
    }
}