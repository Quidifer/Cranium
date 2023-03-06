import 'reflect-metadata';
import express from "express";
import Container, { Service } from "typedi";
import path from 'path';
import Engine from './Engine';
import ManifestParser from './ManifestParser';
import http from 'http';
import ServerConfiguration from './ServerConfiguration';


@Service()
export default class Server {

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
        // Connect React client files to NodeJS server
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