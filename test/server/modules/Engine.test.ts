import path from "path";
import ManifestParser from "../../../server/modules/ManifestParser";
import Container from "typedi";
import Engine from "../../../server/modules/Engine";

describe('server.modules.Engine', () => {
    describe('calculateMoveSet_Transfer', () => {
        test('One Offload, One crate on top', async () => {
            const pathToManifest = path.resolve('./manifests', 'one-crate-on-top.txt');
            const manifest = await Container.get(ManifestParser).parseManifest(pathToManifest);
            const solution = Container.get(Engine).calculateMoveSet_Transfer(manifest, [], [{row: 1, col: 2}]);

            
        });
    });

    describe('calculateMoveSet_Balance', () => {

    });
});