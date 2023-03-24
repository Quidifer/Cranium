import { ParsedManifest } from "../types/ParsedManifest";
import { Service } from "typedi";
import fs from 'fs';
import { ContainerArea } from "../types/ContainerLocation";
import { ShipContainer } from "../types/ShipContainer";

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

    private async parseManifestEntry(stream: string): Promise<ShipContainer> {
        const trimmedStream = stream.replace('[', '').replace(']','').replace('{', '').replace('}','');
        const items = trimmedStream.split(',');
        return {
            name: items[3].trim(),
            weight: parseInt(items[2]),
            // Looks like Y comes before X in manifest examples
            row: parseInt(items[0]),
            col: parseInt(items[1]),
            location: ContainerArea.SHIP
        };
    }

    // Sort entries to appear in the same order as raw manifest file
    public sortManifest(manifest: ParsedManifest): void {
        manifest.sort((a: ShipContainer, b: ShipContainer) => {
            if(a.row === b.row ) return a.col - b.col;
            else return a.row - b.row;
        });
    }
}