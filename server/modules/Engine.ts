import Container, { Inject, Service } from "typedi";
import { MoveSet } from "../types/MoveSet";
import { CraneMove, CraneMoveType } from "../types/CraneMove";
import EngineNode from "../types/EngineNode";
import { FrontEndManifest, Location, Offload, Onload, Ship, ShipContainer, Buffer, FrontEndContainer } from "../types/ShipContainer";
import { ContainerArea } from "../types/ContainerLocation";
import { cloneDeep } from 'lodash';
import { Solution } from "../types/Solution";
import Logger from "./Logger";
import {
    PriorityQueue,
    MinPriorityQueue,
    MaxPriorityQueue,
    ICompare,
    IGetCompareValue,
  } from '@datastructures-js/priority-queue';

  import md5 from 'object-hash';

@Service()
export default class Engine {

    private readonly ENGINE_DEBUG = process.env.ENGINE_DEBUG === '1';

    private readonly SHIP_DIMENSIONS = {
        ROW_MAX: 8,
        COLUMN_MAX: 12
    }

    private readonly BUFFER_DIMENSIONS = { 
        ROW_MAX: 4,
        COLUMN_MAX: 24
    }

    private readonly COST = {
        LOCAL_MOVE: 1,
        TRUCK_MOVE: 2,
        AREA_MOVE: 4,
    }

    private readonly UNUSED_SLOT = 'UNUSED';
    private readonly NON_SLOT = 'NAN';

    private readonly SHIP_VIRTUAL: Location = {row: 8, col: 0};
    // Buffer columns will be indexed backwards
    private readonly BUFFER_VIRTUAL: Location = {row: 5, col: 0};

    private readonly BALANCE_SCORE_GOAL = 0.9;

    constructor(
        @Inject(type => Logger)
        private logger: Logger
    ) {}

    /*
        Transfer works for basic to intermediate ship cases. Buffer is not implemented. 
        Some advanced ship cases with multiple offloads run forever
    */
    public async calculateMoveSet_Transfer(ship: FrontEndManifest, onloads: Array<Onload>, offloads: Array<Offload>): Promise<Solution> { 
        const convertedShip: Ship = this.convertFromFrontEndShip(ship);
        const initial_buffer: Buffer = this.fillBuffer();

        type CostMapType = {
            container: FrontEndContainer,
            cost: number
        }

        const CostMap: Array<CostMapType> = ship.flatMap(container => {
            return {
                container: container,
                cost: this.Manhatten_Distance({row: container.row, col: container.col}, this.SHIP_VIRTUAL)
            };
        }).sort((a,b) => a.cost - b.cost);


        for (let i = 0; i < offloads.length; i++) {
            let offload = offloads[i];
            const offloadCost = this.Manhatten_Distance({row: offload.row, col: offload.col}, this.SHIP_VIRTUAL);
            for (let j = 0; j < CostMap.length; j++) {
                let costItem = CostMap[j];
                if (costItem.container.name === offload.name
                    && (costItem.container.row !== offload.row || costItem.container.col !== offload.col)
                    && costItem.cost < offloadCost
                    && offloads.filter(o => Object.values(o) !== Object.values(offload)).every(o => costItem.container.row !== o.row || costItem.container.col !== o.col)
                ) {
                    offloads[i] = costItem.container;
                    console.log('Viable alternative located.');
                    j = CostMap.length;
                }
            }
        }

        this.engineLog('=== INITIAL SHIP: ===');
        this.engineLog(convertedShip);

        let queuedStates = new MinPriorityQueue<EngineNode>((node) => node.cost);
        let exploredStates = new Map<string, string>();

        let goalStates: Array<EngineNode> = [];

        // Queue initial ship state
        const initialState = new EngineNode(convertedShip, initial_buffer, onloads, offloads);
        initialState.cost = 0;
        initialState.isInitialState = true;
        queuedStates.enqueue(initialState);

        
        do {
            // Grab next Node and remove from queued set
            const leaf = queuedStates.dequeue();
            exploredStates.set(md5(leaf.state), '');
            this.engineLog(`Expanding EngineNode (Ons: ${leaf.onloads.length}, Offs: ${leaf.offloads.length}): ${leaf.id}`)

            // Goal State!
            if(leaf.offloads.length === 0) {
                let newNode: EngineNode = leaf;
                while(newNode.onloads.length > 0) {
                    // We want to place the onload containers as close as possible 
                    // to the SHIP_VIRTUAL square to save cost.
                    for (let col = 0; col < this.SHIP_DIMENSIONS.COLUMN_MAX; col++) {
                        for (let row = 0; row < this.SHIP_DIMENSIONS.ROW_MAX; row++) {
                            if (newNode.state[row][col] === undefined) continue;
                            if (newNode.state[row][col] === null) {
                                const onload = newNode.onloads.pop();
                                if(!onload) break;

                                let new_depth = newNode.depth + 1;
                                let new_cost = this.Manhatten_Distance({row: row+1, col: col+1}, this.SHIP_VIRTUAL);
                                let new_minutes = new_cost + newNode.minutes;
                                let new_state = cloneDeep(newNode.state);
                                new_state[row][col] = this.moveContainer(Object.assign(onload, {row, col, location: ContainerArea.SHIP}), row, col);
                                let move = {
                                    row_start: -1, col_start: -1,
                                    row_end: row+1, col_end: col+1, 
                                    move_type: CraneMoveType.ONLOAD,
                                    container_name: onload.name, 
                                    weight: onload.weight, 
                                    manifest: this.convertToManifest(newNode.state),
                                    buffer: this.convertToManifest(newNode.buffer),
                                    minutesLeft: new_minutes
                                };
                                let new_leaf = new EngineNode(new_state, newNode.buffer, newNode.onloads, newNode.offloads, move, new_minutes);
                                new_leaf.cost = newNode.cost + new_cost + new_depth + this.heuristic(new_leaf);
                                new_leaf.depth = new_depth;
                                new_leaf.previousNode = newNode;
                                newNode = new_leaf;
                                this.engineLog(`Onloading a container named '${onload.name}' to (${row+1},${col+1})`)
                            }
                        }
                    }
                }

                while(!newNode.bufferIsEmpty()) {

                    // We want to place the buffer container as close as possible 
                    // to the SHIP_VIRTUAL square to save cost.
                    for (let col = 0; col < this.SHIP_DIMENSIONS.COLUMN_MAX; col++) {
                        for (let row = 0; row < this.SHIP_DIMENSIONS.ROW_MAX; row++) {
                            if (newNode.state[row][col] === undefined) continue;
                            if (newNode.state[row][col] === null) {
                                let container = newNode.buffer.flatMap((r) => r).filter((container) => container !== null)[0];
                                if (container === null || container === undefined) break;

                                let new_depth = 0;
                                let new_cost = this.Manhatten_Distance({row: row+1, col: col+1}, this.SHIP_VIRTUAL) + this.Manhatten_Distance({row: container.row, col: container.col}, this.BUFFER_VIRTUAL) + this.COST.AREA_MOVE;
                                let new_minutes = new_cost + newNode.minutes;
                                let new_state = cloneDeep(newNode.state);
                                let new_buffer = cloneDeep(newNode.buffer);
                                new_state[row][col] = this.moveContainer(Object.assign({location: ContainerArea.SHIP}, container), row, col);
                                new_buffer[container.row-1][container.col-1] = null;
                                let move = {
                                    row_start: container.row, col_start: container.col, 
                                    row_end: row+1, col_end: col+1, 
                                    move_type: CraneMoveType.BUFFER_TO_SHIP, 
                                    container_name: container.name, 
                                    weight: container.weight,
                                    manifest: this.convertToManifest(newNode.state),
                                    buffer: this.convertToManifest(newNode.buffer),
                                    minutesLeft: new_minutes
                                };
                                let new_leaf = new EngineNode(new_state, new_buffer, newNode.onloads, newNode.offloads, move, new_minutes);
                                new_leaf.cost = new_cost + newNode.cost + new_depth + this.heuristic(new_leaf);
                                new_leaf.depth = new_depth;
                                new_leaf.previousNode = newNode;
                                newNode = new_leaf;
                                this.engineLog(`Moving a container named '${container.name}' from Buffer (Row:${container.row}, Col:${container.col}) to Ship (Row:${row+1}, Col:${col+1}).`)
                            }
                        }
                    }
                }

                // Add final dummy move
                let dummyMove: CraneMove = {
                    row_start: -1, col_start: -1,  row_end: -1, col_end: -1,
                    move_type: CraneMoveType.DUMMY,
                    buffer: [],
                    manifest: this.convertToManifest(newNode.state),
                    container_name: 'invis',
                    minutesLeft: newNode.minutes,
                    weight: -1,
                    step: -1
                }
                let final_state = new EngineNode(newNode.state, [], [], [], dummyMove, newNode.minutes);
                final_state.previousNode = newNode;
                final_state.depth = newNode.depth;
                final_state.cost = newNode.cost;

                goalStates.push(final_state);
                continue;
            }

            if (leaf.state.every(value => value === null || value === undefined)) continue;

            // Find columns that can accept a container
            let allOpenCols: number[] = [];
            for(let column = 0; column < this.SHIP_DIMENSIONS.COLUMN_MAX; column++) 
                if (leaf.state[this.SHIP_DIMENSIONS.ROW_MAX-1][column] === null)
                    allOpenCols.push(column);

            // Generate Possible Moves
            for(let column = 0; column < this.SHIP_DIMENSIONS.COLUMN_MAX; column++) {
                let topCrate!: ShipContainer;
                let topCrate_row = 0;
                for (let row_check = 0; row_check < this.SHIP_DIMENSIONS.ROW_MAX; row_check++) {
                    const container = leaf.state[row_check][column];
                    if (container !== undefined && container !== null) {
                        topCrate = container;
                        topCrate_row = row_check;
                    }
                }

                let leftCol = 0;
                let rightCol = this.SHIP_DIMENSIONS.COLUMN_MAX-1;

                const offloadCols = leaf.offloads.map(offload => offload.col-1);
    
                allOpenCols.forEach(value => {
                    if (value < column && value > leftCol && !offloadCols.some(col => col === value)) leftCol = value;
                    if (value > column && value < rightCol && !offloadCols.some(col => col === value)) rightCol = value;
                });

                let openCols = [leftCol, rightCol];

                if (!topCrate) {
                    this.engineLog(`Column ${column+1} is empty. Continuing...`);
                    continue;
                }

                let containers = [];
                for (let row_check = 0; row_check < this.SHIP_DIMENSIONS.ROW_MAX; row_check++) containers[row_check] = leaf.state[row_check][column];


                // If OffloadCrate is on top
                const isOffloadCrate = leaf.offloads.some(value => value.row === topCrate.row && value.col === topCrate.col);
                const containsOffloadCrate = containers.some(container => leaf.offloads.some(offload => container !== undefined && container !== null && container.row === offload.row && container.col === offload.col));

                if (isOffloadCrate) {
                    this.engineLog(`Found Offload in Column ${column+1}: ${topCrate}`);
                    // Move to truck
                    let new_state = cloneDeep(leaf.state);
                    new_state[topCrate_row][column] = null;
                    let new_offloads = leaf.offloads.filter(value => !(value.row === topCrate.row && value.col === topCrate.col));
                    
                    let new_depth = leaf.depth + 1;
                    let new_cost = this.COST.TRUCK_MOVE + this.Manhatten_Distance({row: topCrate_row+1, col: column+1}, this.SHIP_VIRTUAL);
                    let new_minutes = new_cost + leaf.minutes;
                    let move = {
                        row_start: topCrate_row+1, col_start: column+1, 
                        row_end: -1, col_end: -1, 
                        move_type: CraneMoveType.OFFLOAD, 
                        container_name: topCrate.name, 
                        weight: topCrate.weight,
                        manifest: this.convertToManifest(leaf.state),
                        buffer: this.convertToManifest(leaf.buffer),
                        minutesLeft: new_minutes
                    };
                    let new_leaf = new EngineNode(new_state, cloneDeep(leaf.buffer), cloneDeep(leaf.onloads), new_offloads, move, new_minutes);
                    new_leaf.depth = new_depth;
                    new_leaf.cost = new_cost + leaf.cost + new_depth + this.heuristic(new_leaf);
                    new_leaf.previousNode = leaf;
                    if (!exploredStates.has(md5(new_leaf.state))) {
                        queuedStates.enqueue(new_leaf);
                    }
                }
                else if (containsOffloadCrate) {
                    this.engineLog(`Generating moves for Column ${column+1}`);
                    {
                        // Try Move to buffer
                        let new_state_b = cloneDeep(leaf.state);
                        let new_buffer = cloneDeep(leaf.buffer);
                        new_state_b[topCrate_row][column] = null;
                        let new_row = 0;
                        let new_col = 0;
                        for (let col_check = 0; col_check < this.BUFFER_DIMENSIONS.COLUMN_MAX; col_check++) {
                            new_col = col_check;
                            for (let row_check = 0; row_check < this.BUFFER_DIMENSIONS.ROW_MAX; row_check++) {
                                new_row = row_check;
                                if (new_buffer[row_check][col_check] === null) {
                                    col_check = 100;
                                    row_check = 100;
                                }
                            }
                        }

                        let new_depth = leaf.depth + 1;
                        let new_cost = this.Manhatten_Distance({row: topCrate_row+1, col: column+1}, this.SHIP_VIRTUAL) + this.Manhatten_Distance({row: new_row+1, col:  new_col+1}, this.BUFFER_VIRTUAL) + this.COST.AREA_MOVE;
                        let new_minutes = new_cost + leaf.minutes;
                        new_buffer[new_row][new_col] = this.moveContainer(Object.assign({location: ContainerArea.BUFFER}, topCrate), new_row, new_col);
                        let bmove = {
                            row_start: topCrate_row+1, col_start: column+1, 
                            row_end: new_row+1, col_end: new_col+1,
                            move_type: CraneMoveType.SHIP_TO_BUFFER, 
                            container_name: topCrate.name, 
                            weight: topCrate.weight,
                            manifest: this.convertToManifest(leaf.state),
                            buffer: this.convertToManifest(leaf.buffer),
                            minutesLeft: new_minutes
                        };
                        let new_leaf = new EngineNode(new_state_b, new_buffer, cloneDeep(leaf.onloads), cloneDeep(leaf.offloads), bmove, new_minutes);
                        new_leaf.depth = new_depth;
                        new_leaf.cost = new_cost + leaf.cost + new_depth + this.heuristic(new_leaf);
                        new_leaf.previousNode = leaf;

                        if (!exploredStates.has(md5(new_leaf.state))) {
                            queuedStates.enqueue(new_leaf);
                        }
                    }

                    // Move to other columns
                    openCols.forEach(new_column => {
                        if (new_column === column) return;

                        let new_state = cloneDeep(leaf.state);
                        new_state[topCrate_row][column] = null;
                        let new_row = 0;
                        for (let row_check = 0; row_check < this.SHIP_DIMENSIONS.ROW_MAX; row_check++) {
                            new_row = row_check;
                            if (new_state[row_check][new_column] === null) break;
                        }

                        let new_depth = leaf.depth + 1;
                        let new_cost = this.Manhatten_Distance({row: topCrate_row+1, col: column+1}, {row: new_row+1, col: new_column+1});
                        let new_minutes = new_cost + leaf.minutes;
                        new_state[new_row][new_column] = this.moveContainer(Object.assign({}, topCrate), new_row, new_column);
                        let move = {
                            row_start: topCrate_row+1, col_start: column+1, 
                            row_end: new_row+1, col_end: new_column+1, 
                            move_type: CraneMoveType.SHIP_MOVE, 
                            container_name: topCrate.name, 
                            weight: topCrate.weight,
                            manifest: this.convertToManifest(leaf.state),
                            buffer: this.convertToManifest(leaf.buffer),
                            minutesLeft: new_minutes
                        };
                        let new_leaf = new EngineNode(new_state, cloneDeep(leaf.buffer), cloneDeep(leaf.onloads), cloneDeep(leaf.offloads), move, new_minutes);
                        new_leaf.depth = new_depth;
                        new_leaf.cost = new_cost + leaf.cost + new_depth + this.heuristic(new_leaf);
                        new_leaf.previousNode = leaf;

                        if (!exploredStates.has(md5(new_leaf.state))) {
                            queuedStates.enqueue(new_leaf);
                        }
                    });
                }
                else {
                    this.engineLog(`No Important Containers in Column ${column+1}`);
                }
            }

            // queuedStates = queuedStates.filter((queued: EngineNode) => {
            //     const test = exploredStates.some(explored => Object.values(explored.state) === Object.values(queued.state) && Object.values(explored.offloads) === Object.values(queued.offloads));
            //     return !test;
            // });

            let lowestCost = Infinity;
            goalStates.forEach(goalState => lowestCost = (goalState.cost < lowestCost) ? goalState.cost : lowestCost);
            if (queuedStates.toArray().every(state => state.cost > lowestCost)) break;
        } while(!queuedStates.isEmpty());

        goalStates.sort((a: EngineNode, b: EngineNode) => a.cost - b.cost);

        this.engineLog(`Loop terminated with goal state: ${goalStates[0]?.id}`);
        //this.engineLog(this.convertToManifest(goalStates[0]?.state ?? []));
        this.engineLog(goalStates[0]?.cost ?? 'No Solution');

        return {
            solved: !(goalStates.length === 0),
            moves: (goalStates.length > 0) ? this.convertGoalStateToMoves(goalStates[0]) : undefined,
            final_manifest: (goalStates.length > 0) ? this.convertToManifest(goalStates[0].state) : undefined
        }
    }

    /*
        

    */
    public async calculateMoveSet_Balance(ship: FrontEndManifest): Promise<Solution> { 
        const convertedShip: Ship = this.convertFromFrontEndShip(ship);
        const initial_buffer: Buffer = this.fillBuffer();
        
        const isSolvable = this.checkForBalanceSolution(convertedShip);

        this.engineLog(convertedShip);

        let queuedStates = new MinPriorityQueue<EngineNode>((node) => node.cost);
        let exploredStates = new Map<string, string>();

        let goalStates: Array<EngineNode> = [];

        // Queue initial ship state
        const initialState = new EngineNode(convertedShip, initial_buffer, [], []);
        initialState.isInitialState = true;
        queuedStates.enqueue(initialState);

        // if (!isSolvable) {
        //     goalStates.push(this.SIFT(convertedShip));
        //     return {
        //         solved: !(goalStates.length === 0),
        //         moves: (goalStates.length > 0) ? this.convertGoalStateToMoves(goalStates[0]) : undefined,
        //         final_manifest: (goalStates.length > 0) ? this.convertToManifest(goalStates[0].state) : undefined
        //     } 
        // }

        do {
            // Grab next Node and remove from queued set
            const leaf = queuedStates.dequeue();
            exploredStates.set(md5(leaf.state), '');
            this.engineLog(`Expanding EngineNode (WeightDiff: ${this.balanceScore(leaf)}): ${leaf.id}`)

            // Goal State!
            if(this.isBalanced(leaf)) {
                goalStates.push(leaf);
                continue;
            }

            // Find columns that can accept a container
            let openCols: number[] = [];
            for(let column = 0; column < this.SHIP_DIMENSIONS.COLUMN_MAX; column++)
                if (leaf.state[this.SHIP_DIMENSIONS.ROW_MAX-1][column] === null)
                openCols.push(column);

            // Generate Possible Moves
            for(let column = 0; column < this.SHIP_DIMENSIONS.COLUMN_MAX; column++) {
                let topCrate!: ShipContainer;
                let topCrate_row = 0;
                for (let row_check = 0; row_check < this.SHIP_DIMENSIONS.ROW_MAX; row_check++) {
                    const container = leaf.state[row_check][column];
                    if (container !== undefined && container !== null) {
                        topCrate = container;
                        topCrate_row = row_check;
                    }
                }

                if (!topCrate) {
                    this.engineLog(`Column ${column+1} is empty. Continuing...`);
                    continue;
                }

                let containers = [];
                for (let row_check = 0; row_check < this.SHIP_DIMENSIONS.ROW_MAX; row_check++) containers[row_check] = leaf.state[row_check][column];

                openCols.forEach(new_column => {
                    if (new_column === column) return;

                    let new_state = cloneDeep(leaf.state);
                    new_state[topCrate_row][column] = null;
                    let new_row = 0;
                    for (let row_check = 0; row_check < this.SHIP_DIMENSIONS.ROW_MAX; row_check++) {
                        new_row = row_check;
                        if (new_state[row_check][new_column] === null) break;
                    }

                    new_state[new_row][new_column] = this.moveContainer(Object.assign({}, topCrate), new_row, new_column);

                    let move = {
                        row_start: topCrate_row+1, col_start: column+1,
                        row_end: new_row+1, col_end: new_column+1, 
                        move_type: CraneMoveType.SHIP_MOVE, 
                        container_name: topCrate.name, 
                        weight: topCrate.weight,
                        manifest: this.convertToManifest(new_state),
                        buffer: this.convertToManifest(leaf.buffer),
                        minutesLeft: leaf.cost
                    };
                    let new_leaf = new EngineNode(new_state, leaf.buffer, leaf.onloads, leaf.offloads, move);
                    new_leaf.depth = leaf.depth + 1;
                    new_leaf.cost = leaf.cost + this.Manhatten_Distance_Move(move) + new_leaf.depth + (this.balanceScore(new_leaf) - this.balanceScore(leaf));
                    new_leaf.previousNode = leaf;

                    
                    if (!exploredStates.has(md5(new_leaf.state))) {
                        queuedStates.enqueue(new_leaf);
                    }
                });
            }
        } while(!queuedStates.isEmpty());

        // do SIFT if cant solve it
        // maybe consider a timeout on the balance algorithm

        return {
            solved: !(goalStates.length === 0),
            moves: (goalStates.length > 0) ? this.convertGoalStateToMoves(goalStates[0]) : undefined,
            final_manifest: (goalStates.length > 0) ? this.convertToManifest(goalStates[0].state) : undefined
        } 
    }

    public moveContainer(container: ShipContainer, row: number, col: number): ShipContainer {
        return Object.assign(container, {row: row+1, col: col+1});
    }

    public Manhatten_Distance(start: Location, end: Location): number {
        return (Math.abs(end.row - start.row) + Math.abs(end.col - start.col))*this.COST.LOCAL_MOVE;
    }

    public Manhatten_Distance_Move(move: CraneMove): number {
        return (Math.abs(move.row_end - move.row_start) + Math.abs(move.col_end - move.col_start))*this.COST.LOCAL_MOVE;
    }

    public balanceScore(node: EngineNode) {
        const midline = (this.SHIP_DIMENSIONS.COLUMN_MAX - 1)/2;
        let leftSide = 0;
        let rightSide = 0;

        node.state.forEach(row => {
            row.forEach(cell => {
               if (cell !== undefined && cell !== null) {
                if ((cell.col - 1) < midline)
                    leftSide += cell.weight;
                else {
                    rightSide += cell.weight;
                } 
               }
            });
        });
        return Math.min(leftSide, rightSide)/Math.max(leftSide, rightSide);
    }

    public isBalanced(node: EngineNode) {
        return this.balanceScore(node) > this.BALANCE_SCORE_GOAL;
    }

    private heuristic(node: EngineNode) {
        let buffer: ShipContainer[] = [];
        node.buffer.forEach(row => row.forEach(container => { if(container !== null) buffer.push(container) }));
        const bufferOnloads = buffer.map(container => this.Manhatten_Distance({row: container.row, col: container.col}, this.BUFFER_VIRTUAL) + this.COST.AREA_MOVE).reduce((prev, curr) => prev + curr, 0);
        const offloadCosts = node.offloads.map(offload => this.Manhatten_Distance({row: offload.row, col: offload.col}, this.SHIP_VIRTUAL) + this.COST.TRUCK_MOVE).reduce((prev, curr) => prev + curr, 0);
        return this.cratesInTheWay(node) + offloadCosts + bufferOnloads;
    }

    private cratesInTheWay(node: EngineNode): number {
        let cratesInTheWay = 0;
        node.offloads.forEach(offload => {
            for(let rowCount = offload.row; rowCount < this.SHIP_DIMENSIONS.ROW_MAX; rowCount++) {
                if (node.state[rowCount][offload.col] === null) break;
                cratesInTheWay++;
            }
        });
        // Scale importance of cratesInTheWay
        return cratesInTheWay*2;
    }

    private convertGoalStateToMoves(goalState: EngineNode): Array<CraneMove> {
        let moves: Array<CraneMove> = [];

        let state: EngineNode | undefined = goalState;
        while(state !== undefined) {
            if (!!state.move) moves = [state.move, ...moves];
            state = state.previousNode;
        }

        moves.forEach((move, index) => move.step = index+1);
        
        return moves;
    }

    private convertFromFrontEndShip(ship: FrontEndManifest): Ship {
        let convertedShip: Ship = new Array(this.SHIP_DIMENSIONS.ROW_MAX)
        .fill(undefined)
        .map(() => new Array(this.SHIP_DIMENSIONS.COLUMN_MAX)
        .fill(undefined));

        ship.forEach(value => {
            switch(value.name) {
                case this.NON_SLOT: {
                    convertedShip[value.row-1][value.col-1] = undefined;
                    break;
                }
                case this.UNUSED_SLOT: {
                    convertedShip[value.row-1][value.col-1] = null;
                    break;
                }
                default: {
                    convertedShip[value.row-1][value.col-1] = Object.assign(value, {location: ContainerArea.SHIP});
                    break;
                }
            }
        });
        return convertedShip;
    }

    private convertToManifest(ship: Ship): FrontEndManifest {
        let manifest: FrontEndManifest = [];

        ship.forEach((row, rowIndex) => {
            row.forEach((container, colIndex) => {
                switch(container) {
                    case null: {
                        manifest.push({name: 'UNUSED', weight: 0, row: rowIndex+1, col: colIndex+1});
                        break;
                    }
                    case undefined: {
                        manifest.push({name: 'NAN', weight: 0, row: rowIndex+1, col: colIndex+1});
                        break;
                    }
                    default: {
                        manifest.push(container);
                        break;
                    }
                }
            });
        });
        return manifest;
    }

    private fillBuffer(): Buffer {
        let buffer: Buffer = [];
        for(let row = 0; row < this.BUFFER_DIMENSIONS.ROW_MAX; row++) {
            const newArray = new Array<ShipContainer | null>(this.BUFFER_DIMENSIONS.COLUMN_MAX).fill(null);
            buffer[row] = newArray;
        }
        return buffer;
    }

    private checkForBalanceSolution(ship: Ship): boolean {
        // Container weights sorted in DESCENDING order
        let weightArray = 
            (ship
            .flat()
            .filter(container => container !== null && container !== undefined) as ShipContainer[])
            .map(container => container.weight)
            .sort((a,b) => b - a);


        let pile1 = 0, pile2 = 0;
        weightArray.forEach(weight => {
            if (pile1 < pile2) {
                pile1 += weight;
            }
            else {
                pile2 += weight;
            }
        });
        return (Math.min(pile1, pile2)/Math.max(pile1, pile2) > this.BALANCE_SCORE_GOAL);
    }

    private SIFT(node: EngineNode): EngineNode {
        console.log('PERFORMING SIFT');
        let newNode: EngineNode = node;

        let newBuffer = this.fillBuffer();
        let BufferMap = 
        (newNode.state
        .flat()
        .filter(c => c !== null && c !== undefined) as ShipContainer[])
        .flatMap(c => {
            return { container: c, weight: c.weight }
        })
        .sort((a,b) => a.weight - b.weight);

        let BufferTargets = [];
        for (let row = 0; row < this.BUFFER_DIMENSIONS.ROW_MAX; row++) {
            for (let col = 0; col < this.BUFFER_DIMENSIONS.COLUMN_MAX; col++) {
                if (newBuffer[row][col] === null && BufferMap.length > 0) {
                    const o = BufferMap[BufferMap.length-1];
                    BufferMap = BufferMap.slice(1, BufferMap.length);
                    newBuffer[row][col] = o.container;
                    BufferTargets.push({
                        container: o.container,
                        a: {row: o.container.row-1, col: o.container.col-1},
                        b: {row, col}
                    });
                }
            }
        }
        
        // Move everything to buffer
        // while(BufferTargets.length > 0) {
        //     let possibleMoves = [];

        //     for(let move of BufferTargets) {
        //         let point1Available = 
        //             (move.a.row === this.SHIP_DIMENSIONS.ROW_MAX-1) ||
        //             (newNode.state[move.a.row+1][move.a.col] === null)
        //         if (
        //             newNode.state[move.a.row][move.a.col] ==
        //         )
        //     }


            for(let column = 0; column < this.SHIP_DIMENSIONS.COLUMN_MAX; column++) {
                for (let row = this.SHIP_DIMENSIONS.ROW_MAX; row >= 0; row--) {
                    let topCrate = newNode.state[row][column];
                    if (!topCrate) continue;

                    let new_state_b = cloneDeep(newNode.state);
                    let new_buffer = cloneDeep(newNode.buffer);
                    new_state_b[row][column] = null;
                    let new_row = 0;
                    let new_col = 0;
                    for (let col_check = 0; col_check < this.BUFFER_DIMENSIONS.COLUMN_MAX; col_check++) {
                        new_col = col_check;
                        for (let row_check = 0; row_check < this.BUFFER_DIMENSIONS.ROW_MAX; row_check++) {
                            new_row = row_check;
                            if (new_buffer[row_check][col_check] === null) {
                                col_check = Infinity;
                                row_check = Infinity;
                            }
                        }
                    }

                    let new_depth = newNode.depth + 1;
                    let new_cost = this.Manhatten_Distance({row: row+1, col: column+1}, this.SHIP_VIRTUAL) + this.Manhatten_Distance({row: new_row+1, col:  new_col+1}, this.BUFFER_VIRTUAL) + this.COST.AREA_MOVE;
                    let new_minutes = new_cost + newNode.minutes;
                    new_buffer[new_row][new_col] = this.moveContainer(Object.assign({location: ContainerArea.BUFFER}, topCrate), new_row, new_col);
                    let bmove = {
                        row_start: row+1, col_start: column+1, 
                        row_end: new_row+1, col_end: new_col+1,
                        move_type: CraneMoveType.SHIP_TO_BUFFER, 
                        container_name: topCrate.name, 
                        weight: topCrate.weight,
                        manifest: this.convertToManifest(newNode.state),
                        buffer: this.convertToManifest(newNode.buffer),
                        minutesLeft: new_minutes
                    };
                    let new_leaf = new EngineNode(new_state_b, new_buffer, cloneDeep(newNode.onloads), cloneDeep(newNode.offloads), bmove, new_minutes);
                    new_leaf.depth = new_depth;
                    new_leaf.cost = new_cost + newNode.cost + new_depth + this.heuristic(new_leaf);
                    new_leaf.previousNode = newNode;
                }
            }
        return newNode;
    }

    private engineLog(input: any) {
        if (this.ENGINE_DEBUG) {
            console.log(`ENGINE: ${(typeof input === 'string') ? input : ''}`);
            if (typeof input !== 'string') console.log(input);
        }
    }
}