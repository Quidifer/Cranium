"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
const typedi_1 = require("typedi");
const fs_1 = __importDefault(require("fs"));
let ManifestParser = class ManifestParser {
    constructor() {
        this.parseManifestEntry.bind(this);
        this.sortManifest.bind(this);
    }
    parseManifest(fileOrBuffer) {
        return __awaiter(this, void 0, void 0, function* () {
            const buffer = (fileOrBuffer instanceof Buffer) ? fileOrBuffer : fs_1.default.readFileSync(fileOrBuffer);
            const lines = buffer.toString('utf8').split('\n');
            // Running these asynchronously for small performance improvement!
            const manifest = yield Promise.all(lines.map((value) => this.parseManifestEntry(value)));
            this.sortManifest(manifest);
            return manifest;
        });
    }
    parseManifestEntry(stream) {
        return __awaiter(this, void 0, void 0, function* () {
            const trimmedStream = stream.replace('[', '').replace(']', '').replace('{', '').replace('}', '');
            const items = trimmedStream.split(',');
            return {
                // Looks like Y comes before X in manifest examples
                Y: parseInt(items[0]),
                X: parseInt(items[1]),
                weight: parseInt(items[2]),
                text: items[3].trim()
            };
        });
    }
    // Sort entries to appear in the same order as raw manifest file
    sortManifest(manifest) {
        manifest.sort((a, b) => {
            if (a.Y === b.Y)
                return a.X - b.X;
            else
                return a.Y - b.Y;
        });
    }
};
ManifestParser = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [])
], ManifestParser);
exports.default = ManifestParser;
//# sourceMappingURL=ManifestParser.js.map