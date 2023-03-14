"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
class EngineNode {
    constructor(state, depth) {
        this.isInitialState = false;
        this.id = (0, uuid_1.v4)();
        this.state = state;
        this.depth = depth;
    }
}
exports.default = EngineNode;
//# sourceMappingURL=EngineNode.js.map