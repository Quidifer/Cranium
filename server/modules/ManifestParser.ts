import { ParsedManifest, ParsedManifestEntry } from "../types/ParsedManifest";
import { Service } from "typedi";
import fs from 'fs';

@Service()
export default class ManifestParser {

    constructor() {
        this.parseManifestEntry.bind(this);
        this.sortManifest.bind(this);
    }

    public async parseManifest(fileOrBuffer: string | Buffer): Promise<ParsedManifest> { 
        const buffer = (fileOrBuffer instanceof Buffer) ? fileOrBuffer : fs.readFileSync(fileOrBuffer);
        const lines = buffer.toString('utf8').split('\n');

        // Running these asynchronously for small performance improvement!
        const manifest: ParsedManifest = await Promise.all(lines.map((value) => this.parseManifestEntry(value)));
        this.sortManifest(manifest);
        return manifest;
    }

    private async parseManifestEntry(stream: string): Promise<ParsedManifestEntry> {
        const trimmedStream = stream.replace('[', '').replace(']','').replace('{', '').replace('}','');
        const items = trimmedStream.split(',');
        return {
            // Looks like Y comes before X in manifest examples
            Y: parseInt(items[0]),
            X: parseInt(items[1]),
            weight: parseInt(items[2]),
            text: items[3].trim()
        };
    }

    // Sort entries to appear in the same order as raw manifest file
    public sortManifest(manifest: ParsedManifest): void {
        manifest.sort((a: ParsedManifestEntry, b: ParsedManifestEntry) => {
            if(a.Y === b.Y ) return a.X - b.X;
            else return a.Y - b.Y;
        });
    }
}