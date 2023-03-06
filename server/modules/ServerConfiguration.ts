import Container, { Inject, Service } from "typedi";
import express, { RequestHandler } from "express";
import Engine from "./Engine";
import ManifestParser from "./ManifestParser";

@Service()
export default class ServerConfiguration {

    constructor(
        @Inject(type => Engine)
        private engine: Engine,

        @Inject(type => ManifestParser)
        private manifestParser: ManifestParser
    ) {}

    public setupEndpoints(app: express.Application) {
        app.get("/transfer", (req, res) => res.json(this.engine.calculateMoveSet_Transfer(req.body)));
        app.get("/balance", (req, res) => res.json(this.engine.calculateMoveSet_Balance(req.body)));
        app.get("/manifest", async (req, res) => {
            res.json(await this.manifestParser.parseManifest('./resources/example_manifest.txt'));
        });
    }
}