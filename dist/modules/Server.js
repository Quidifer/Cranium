"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const typedi_1 = __importStar(require("typedi"));
const path_1 = __importDefault(require("path"));
const Engine_1 = __importDefault(require("./Engine"));
const ManifestParser_1 = __importDefault(require("./ManifestParser"));
let e = class e {
    constructor() {
        this.PORT = process.env.PORT || 3001;
        this.REACT_FRONT_END = path_1.default.resolve(__dirname, '../client');
        this.app = (0, express_1.default)();
        process.on('SIGINT', this.onSignalTerminationHandler.bind(this));
        process.on('SIGTERM', this.onSignalTerminationHandler.bind(this));
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            const engine = typedi_1.default.get(Engine_1.default);
            const manifestParser = typedi_1.default.get(ManifestParser_1.default);
            this.app.use(express_1.default.static(this.REACT_FRONT_END));
            this.app.get("/transfer", (req, res) => res.json(engine.calculateMoveSet_Transfer(req.body)));
            this.app.get("/balance", (req, res) => res.json(engine.calculateMoveSet_Balance(req.body)));
            this.app.get("/manifest", (req, res) => __awaiter(this, void 0, void 0, function* () {
                res.json(yield manifestParser.parseManifest('./server/modules/test.txt'));
            }));
            this.listener = this.app.listen(this.PORT, () => console.log(`Server listening on ${this.PORT}`));
        });
    }
    close() {
        console.log("Closing server...");
        this.listener.close();
    }
    // Handle unexpected server shutdown gracefully
    onSignalTerminationHandler() {
        this.close();
    }
};
e = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [])
], e);
exports.default = e;
//# sourceMappingURL=Server.js.map