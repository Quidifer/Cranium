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
const postgresql_1 = require("@mikro-orm/postgresql");
const typedi_1 = require("typedi");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
let DatabaseManager = class DatabaseManager {
    constructor() {
        this.MigrationsPath = path_1.default.resolve(process.cwd(), './dist/migrations');
        process.on('SIGINT', this.onSignalTerminationHandler.bind(this));
        process.on('SIGTERM', this.onSignalTerminationHandler.bind(this));
    }
    getEntityManager() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.orm)
                yield this.getMikroOrm();
            return this.orm.em.fork();
        });
    }
    getMikroOrm() {
        return __awaiter(this, void 0, void 0, function* () {
            this.orm = yield postgresql_1.MikroORM.init({
                entities: ['./dist/entities'],
                dbName: 'application',
                type: 'postgresql',
                user: 'root',
                logger: (message) => console.log(message),
                password: 'totallySecurePassword',
                host: '0.0.0.0',
                port: 5432,
                debug: false,
                migrations: {
                    tableName: 'mikro_orm_migrations',
                    migrationsList: this.getMigrations(),
                    path: this.MigrationsPath,
                    transactional: true,
                    disableForeignKeys: true,
                    allOrNothing: true,
                    dropTables: true,
                    safe: false,
                    emit: 'ts'
                }
            }, true);
            return this.orm;
        });
    }
    getMigrations() {
        const Migrations = [];
        const files = fs_1.default.readdirSync(this.MigrationsPath);
        files.forEach((file) => {
            if ((file.match(/\.ts$/) || file.match(/\.js$/)) && !file.match(/\.d\.ts$/)) {
                //eslint-disable-next-line @typescript-eslint/no-var-requires
                const module = require(path_1.default.resolve(this.MigrationsPath, file));
                for (const key in module) {
                    if (key.match(/Migration\d+/)) {
                        Migrations.push({
                            name: key,
                            class: module[key]
                        });
                    }
                }
            }
        });
        return Migrations;
    }
    setMigration() {
        return __awaiter(this, void 0, void 0, function* () {
            const migrator = this.orm.getMigrator();
            const entities = this.orm.config.get('entities');
            const migrationsList = this.getMigrations();
            if ((!migrationsList || migrationsList.length === 0) && entities.length > 0) {
                yield migrator.createInitialMigration();
                throw new Error("Initial Migration Required.");
            }
            yield migrator.up();
            const migrationResult = yield migrator.createMigration();
            if (migrationResult.diff.down.length > 0 || migrationResult.diff.up.length > 0) {
                throw new Error("Migration Update Required.");
            }
        });
    }
    up() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.getMikroOrm();
            this.setMigration();
        });
    }
    down() {
        return __awaiter(this, void 0, void 0, function* () {
            if (yield this.orm.isConnected()) {
                yield this.orm.close();
            }
        });
    }
    onSignalTerminationHandler() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.down();
        });
    }
};
DatabaseManager = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [])
], DatabaseManager);
exports.default = DatabaseManager;
//# sourceMappingURL=DatabaseManager.js.map