import 'reflect-metadata';
import express from "express";
import Container, { Service } from "typedi";
import path from 'path';
import Engine from './Engine';
import ManifestParser from './ManifestParser';
import http from 'http';
import ServerConfiguration from './ServerConfiguration';
import bodyParser from 'body-parser';
import { writeFileSync } from 'fs';
import DatabaseConfiguration from './DatabaseConfiguration';
import DatabaseManager from './DatabaseManager';


@Service()
export default class Server {

    private app: express.Application;

    private PORT: (string | number) = 3001;

    private listener!: http.Server;

    private readonly REACT_FRONT_END: string = DatabaseManager.isTsNode() ? path.resolve(process.cwd(), './client') : path.resolve(process.cwd(), './dist', './client');

    constructor() {
        this.app = express();
        this.app.use(bodyParser.urlencoded({
            extended: true
        }));
        this.app.use(bodyParser.json());
        process.on('SIGINT', this.onSignalTerminationHandler.bind(this));
        process.on('SIGTERM', this.onSignalTerminationHandler.bind(this));
    }

    public async start() {
        // // Connect React client files to NodeJS server
        const manifest = await Container.get(ManifestParser).parseManifest(path.resolve(process.cwd(), './test/server/modules/manifests/shipCase1.txt'));
        const solution = await Container.get(Engine).calculateMoveSet_Balance(manifest); 
        console.log(solution.moves?.map(move => Object.assign(move, {manifest: [], buffer: []})))
        //writeFileSync('output.json', JSON.stringify(solution));
        //Container.get(Engine).calculateMoveSet_Balance(manifest);ya
        this.app.use(express.static(this.REACT_FRONT_END));
        Container.get(ServerConfiguration).setupEndpoints(this.app);
        this.listener = this.app.listen(this.PORT, () => console.log(`Server listening on ${this.PORT}`));
    
    }

    public close() {
        console.log("Closing server...");
        this.listener.close();
    }

    // Handle unexpected server shutdown gracefully
    private onSignalTerminationHandler() {
        this.close();
    }
}