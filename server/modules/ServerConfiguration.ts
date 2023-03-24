import Container, { Inject, Service } from "typedi";
import express, { RequestHandler, request } from "express";
import Engine from "./Engine";
import ManifestParser from "./ManifestParser";
import { v4 as uuidv4 } from "uuid";
import { Solution } from "../types/Solution";
import { Response } from "express";
import { EntityManager } from "@mikro-orm/postgresql";
import UserSession from "../entities/UserSession";
import Logger, { LogEventType } from "./Logger";
import { CraneMoveType } from "../types/CraneMove";
import DatabaseManager from "./DatabaseManager";

@Service()
export default class ServerConfiguration {

    constructor (
        @Inject(type => Logger)
        private logger: Logger
    ) {}

    public setupEndpoints(app: express.Application) {
        app.get("/check", async (req, res) => await this.handleCheckRequest(res));
        app.post("/job", async (req, res) => await this.handleJobRequest(res, req.body));
        app.get("/solution", async (req, res) => await this.handleSolutionRequest(res));
        app.get("/move", async (req, res) => await this.handleMoveRequest(res));
        app.get("/log", async (req, res) => await this.handleLogRequest('GET', res, {}));
        app.post("/log", async (req, res) => await this.handleLogRequest('POST', res, req.body));
    }

    private async handleCheckRequest(res: Response) {
        const StoredSolution = await this.fetchSession(res);
        res.status(StoredSolution?.solution !== undefined ? 200 : 404).send();
    }

    private async handleJobRequest(res: Response, requestBody: any) {
        const job = requestBody.job;
        if (!job) res.status(400).send(`Bad Request: Missing request parameter 'job'`);

        // Wait for front end to render
        await this.wait(200);

        console.log(`${job} Request Received.`);
        console.log('=== JOB DATA ===');
        console.log(Object.assign({}, requestBody, {manifest: 'TRUNCATED'}));
        
        switch(job) {
            case 'TRANSFER': {
                await this.handleTransferRequest(res, requestBody);
                break;
            }
            case 'BALANCE': {
                await this.handleBalanceRequest(res, requestBody);
                break;
            }
            default: {
                res.status(400).send(`Bad Request: Unknown 'job' parameter '${job}'`);
                break;
            }
        }
    }

    private async handleTransferRequest(res: Response, requestBody: any) {
        const { manifest, onloads, offloads, username } = requestBody;
        const solution: Solution = await Container.get(Engine).calculateMoveSet_Transfer(manifest, onloads, offloads);
        let Session = await this.fetchSession(res);
        if (Session === null) {
            res.status(500).send('TRANSFER ERROR: UserSession could not be found.');
            throw new Error("Could not store TRANSFER solution, UserSession not found.");
        }
        if (solution === undefined) {
            res.status(500).send('TRANSFER ERROR: Could not find solution');
            throw new Error("Could not locate a goal state.");
        }
        Session.setSolution(solution);
        console.log('Solution set to database.');
        await (await Container.get(DatabaseManager).getEntityManager()).persistAndFlush(Session);
        const { solved } = solution;
        console.log('Responding to client...');
        res.status(solved ? 200 : 500).send(solved);
    }

    private async handleBalanceRequest(res: Response, requestBody: any) {
        const { manifest, username } = requestBody;
        const solution: Solution = await Container.get(Engine).calculateMoveSet_Balance(manifest);
        let Session = await this.fetchSession(res);
        if (Session === null) {
            res.status(500).send('BALANCE ERROR: UserSession could not be found.');
            throw new Error("Could not store TRANSFER solution, UserSession not found.");
        }
        if (solution === undefined) {
            res.status(500).send('BALANCE ERROR: Could not find solution');
            throw new Error("Could not locate a goal state.");
        }
        Session.setSolution(solution);
        console.log('Solution set to database.');
        await (await Container.get(DatabaseManager).getEntityManager()).persistAndFlush(Session);
        const { solved } = solution;
        res.status(solved ? 200 : 500).send(solved);
    }

    private async handleSolutionRequest(res: Response) {
        const StoredSolution = await this.fetchSession(res);
        if (StoredSolution?.solution === undefined) 
            res.status(404).send("No solution in database.");
        else 
            res.status(200).json(StoredSolution.toDto());
    }

    private async handleMoveRequest(res: Response) {
        const StoredSolution = await this.fetchSession(res);
        if (StoredSolution === null || StoredSolution.solution?.moves === undefined) 
            res.status(404).send("No solution in database.");
        else {
            const move = StoredSolution.solution.moves[StoredSolution.currentMove - 1];
            console.log(`Move ${move.move_type} has been executed.`);
            switch (move.move_type) {
                case CraneMoveType.OFFLOAD: {
                    this.logger.appendToLog(`OFFLOAD: '${move.container_name}' from (Row: ${move.row_start}, Col: ${move.col_start}).`);
                    break;
                }
                case CraneMoveType.ONLOAD: {
                    this.logger.appendToLog(`ONLOAD: '${move.container_name}' to (Row: ${move.row_end}, Col: ${move.col_end}).`);
                    break;
                }
                case CraneMoveType.SHIP_MOVE: {
                    this.logger.appendToLog(`SHIP_MOVE: '${move.container_name}' (Row: ${move.row_start}, Col: ${move.col_start}) => (Row: ${move.row_end}, Col: ${move.col_end})`);
                    break;
                }
                case CraneMoveType.BUFFER_MOVE: {
                    this.logger.appendToLog(`BUFFER_MOVE: '${move.container_name}' (Row: ${move.row_start}, Col: ${move.col_start}) => (Row: ${move.row_end}, Col: ${move.col_end})`);
                    break;
                }
                case CraneMoveType.SHIP_TO_BUFFER: {
                    this.logger.appendToLog(`AREA_MOVE: '${move.container_name}' SHIP (Row: ${move.row_start}, Col: ${move.col_start}) => BUFFER (Row: ${move.row_end}, Col: ${move.col_end})`);
                    break;
                }
                case CraneMoveType.BUFFER_TO_SHIP: {
                    this.logger.appendToLog(`AREA_MOVE: '${move.container_name}' BUFFER (Row: ${move.row_start}, Col: ${move.col_start}) => SHIP (Row: ${move.row_end}, Col: ${move.col_end})`);
                    break;
                }
            }
            StoredSolution.currentMove++;
            const em = (await Container.get(DatabaseManager).getEntityManager());
            if (StoredSolution.currentMove > StoredSolution.solution.moves.length) {
                StoredSolution.solution = undefined;
                await em.persistAndFlush(StoredSolution);
            }
            else {
                await em.persistAndFlush(StoredSolution);
            }
            res.status(200).send("Move counter updated.");
        }
    }

    private async handleLogRequest(type: 'GET' | 'POST', res: Response, requestBody: any) {
        switch (type) {
            case 'GET': {
                res.status(200).send(Container.get(Logger).readLog());
                break;
            }
            case 'POST': {
                console.log(requestBody);
                if (requestBody.logType) {
                    switch (requestBody.logType) {
                        case LogEventType.SIGN_IN: {
                            let session = await this.fetchSession(res);
                            if (session !== null) {
                                this.logger.appendToLog(`${session.username} signs out.`);
                            }
                            else {
                                session = new UserSession(requestBody.message);
                            }
                            this.logger.appendToLog(`${session.username} signs in.`);
                            (await Container.get(DatabaseManager).getEntityManager()).persistAndFlush(session);
                            res.status(200).send();
                            break;
                        }
                        case LogEventType.NONE: {
                            this.logger.appendToLog(requestBody.message);
                        }
                    }
                }
                else
                    res.status(400).send(`logType required.`);
                break;
            }
        }
    }

    private async fetchSession(res: Response): Promise<UserSession | null> {
        const em = (await Container.get(DatabaseManager).getEntityManager());
        const session = await em.find(UserSession, {});
        return session[0] ?? null;
    }

    private async wait(ms: number) {
        let newPromise = new Promise<void>(res => {
            setTimeout(() => res(), ms);
        });

        return newPromise;
    }
}