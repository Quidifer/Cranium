import { EntityManager, MikroORM, PostgreSqlDriver } from '@mikro-orm/postgresql';
import { Service } from "typedi";
import { Constructor } from '@mikro-orm/core';
import { Migration } from '@mikro-orm/migrations';
import path from 'path';
import fs from 'fs';

type MigrationObject = {
    name: string;
    class: Constructor<Migration>;
}

@Service()
export default class DatabaseManager {

    private orm!: MikroORM;

    private readonly MigrationsPath: string = path.resolve(process.cwd(), './dist/migrations');

    constructor() {
        process.on('SIGINT', this.onSignalTerminationHandler.bind(this));
        process.on('SIGTERM', this.onSignalTerminationHandler.bind(this));
    }

    public async getEntityManager(): Promise<EntityManager> {
        if (!this.orm) await this.getMikroOrm();
        return this.orm.em.fork();
    }

    private async getMikroOrm(): Promise<MikroORM> {
        this.orm = await MikroORM.init<PostgreSqlDriver>({
            entities: ['./dist/entities'],
            dbName: 'application',
            type: 'postgresql',
            user: 'root',
            logger: (message: string) => console.log(message),
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
    }

    private getMigrations(): MigrationObject[] {
        const Migrations: MigrationObject[] = [];
        const files = fs.readdirSync(this.MigrationsPath);
        files.forEach((file) => {
            if((file.match(/\.ts$/) || file.match(/\.js$/)) && !file.match(/\.d\.ts$/)) {
                //eslint-disable-next-line @typescript-eslint/no-var-requires
                const module = require(path.resolve(this.MigrationsPath, file));
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

    private async setMigration(): Promise<void> {
        const migrator = this.orm.getMigrator();
        const entities = this.orm.config.get('entities');
        const migrationsList = this.getMigrations();

        if ((!migrationsList || migrationsList.length === 0) && entities.length > 0) {
            await migrator.createInitialMigration();
            throw new Error("Initial Migration Required.");
        }

        await migrator.up();

        const migrationResult = await migrator.createMigration();
        if(migrationResult.diff.down.length > 0 || migrationResult.diff.up.length > 0) {
            throw new Error("Migration Update Required.");
        }
    }

    public async up(): Promise<void> {
        await this.getMikroOrm();
        this.setMigration();
    }

    public async down(): Promise<void> {
        if (await this.orm.isConnected()) {
            await this.orm.close();
        }
    }

    private async onSignalTerminationHandler(): Promise<void> {
        await this.down();
    }
}   