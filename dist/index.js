"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typedi_1 = __importDefault(require("typedi"));
const Server_1 = __importDefault(require("./modules/Server"));
const DatabaseManager_1 = __importDefault(require("./modules/DatabaseManager"));
const server = typedi_1.default.get(Server_1.default);
typedi_1.default.get(DatabaseManager_1.default).up();
console.log("Starting Cranium Server...");
process.on('uncaughtException', (error) => {
    // Close listener gracefully
    server.close();
    console.error(error);
    process.exit(1);
});
process.on('unhandledRejection', (error) => {
    // Close listener gracefully
    server.close();
    console.error(error);
    process.exit(1);
});
// Start backend
server
    .start()
    .catch((error) => {
    console.log(error);
    process.exit(1);
});
//# sourceMappingURL=index.js.map