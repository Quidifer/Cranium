"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typedi_1 = require("typedi");
const EngineNode_1 = __importDefault(require("../types/EngineNode"));
let Engine = class Engine {
    constructor() {
        // Double check these numbers
        this.COST = {
            LOCAL_MOVE: 1,
            AREA_MOVE: 4,
        };
    }
    // heuristic
    calculateMoveSet_Transfer(ship) {
        const exploredState = [];
        const queuedStates = [];
        const goalStates = [];
        // Queue initial ship state
        const initialState = new EngineNode_1.default(ship, 0);
        initialState.isInitialState = true;
        queuedStates.push(initialState);
        do {
            // Grab next Node and remove from queued set
            const leaf = queuedStates[0];
            queuedStates.filter((value) => value.id != leaf.id);
        } while (queuedStates.length > 0);
    }
    calculateMoveSet_Balance(ship) {
        // implement
    }
    simulateMove(ship, move) {
        // implement
    }
    determinePossibleMoves(ship) {
        // implement
    }
};
Engine = __decorate([
    (0, typedi_1.Service)()
], Engine);
exports.default = Engine;
//# sourceMappingURL=Engine.js.map