import { Service } from "typedi";
import { existsSync, read, readFile, readFileSync, writeFileSync } from 'fs';
import path from 'path';

/*
    Sign in
    Sign out
    Manifest is open
    offloads
    onloads
    Finishing cycle
*/

export enum LogEventType {
    NONE = 'NONE',
    SIGN_IN = 'SIGN_IN',
}

@Service()
export default class Logger {

    private readonly FILE_NAME = `KeoghLongBeach${new Date().getFullYear()}.txt`;
    private readonly FILE_PATH = process.cwd();

    constructor() {
        this.checkLogFile();
    }

    private getPath = () => path.resolve(this.FILE_PATH, this.FILE_NAME);

    private writeToFile = (toWrite: string) => writeFileSync(this.getPath(), toWrite);
    private readFromFile = () => readFileSync(this.getPath(), 'utf-8');

    private checkLogFile() {
        const logFileExists = existsSync(this.getPath());
        if (!logFileExists) {
            console.log(`Logfile does not exist. Creating new logfile: '${this.getPath()}'`);
            this.writeToFile('');
        }
    }

    public appendToLog(toLog: string) {
        this.checkLogFile();
        const date = new Date();
        const timestamp = `${date.toLocaleString('en-us', { year:"numeric", month:"short", day:"numeric"})} : ${date.getHours()}:${date.getMinutes().toString().padStart(2,'0')}`;
        const logLine = `${timestamp} - ${toLog}\n`;
        const fileContents = this.readFromFile();
        this.writeToFile(fileContents + logLine);
        console.log('Log updated.');
    }

    public readLog() {
        return this.readFromFile();
    }
}