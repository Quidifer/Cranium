import 'reflect-metadata';
import express from "express";
import Container, { Service } from "typedi";
import path from 'path';
import Engine from './Engine';
import ManifestParser from './ManifestParser';
import http from 'http';


@Service()
export default class e {

    private app: express.Application;

    private PORT: (string | number) = process.env.PORT || 3001;

    private listener!: http.Server;

    private readonly REACT_FRONT_END: string = path.resolve(__dirname, '../client');

    constructor() {
        this.app = express();
        process.on('SIGINT', this.onSignalTerminationHandler.bind(this));
        process.on('SIGTERM', this.onSignalTerminationHandler.bind(this));
    }

    public async start() {
        const engine = Container.get(Engine);
        const manifestParser = Container.get(ManifestParser);
        this.app.use(express.static(this.REACT_FRONT_END));
        this.app.get("/transfer", (req, res) => res.json(engine.calculateMoveSet_Transfer(req.body)));
        this.app.get("/balance", (req, res) => res.json(engine.calculateMoveSet_Balance(req.body)));
        this.app.get("/manifest", async (req, res) => {
            res.json(await manifestParser.parseManifest('./server/modules/test.txt'));
        });
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