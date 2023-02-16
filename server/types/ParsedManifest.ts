type ParsedManifestEntry = {
    Y: number;
    X: number;
    weight: number;
    text: string
}

type ParsedManifest = Array<ParsedManifestEntry>;

export type { ParsedManifestEntry, ParsedManifest };