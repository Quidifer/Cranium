import { Ship, ShipContainer } from "./ShipContainer";
import { Location } from "./ShipContainer";

type BufferAction = 'Add' | 'Remove';

export default class Buffer {
    
    // Array will be indexed in reverse. 0,0 will be bottom-right buffer location.
    public contents: Array<Array<ShipContainer>>;

    private TRANSFER_LOCATION: Location = {row: 5, col: 1};
    private TRANSFER_LOCATION_SHIP: Location = {row: 5, col: 1};

    constructor() {
        this.contents = [[]];
    }

    // public cost(container: ShipContainer, action: BufferAction): number {
    //     switch(action) {
    //         case 'Add':
    //             return 
    //             break;
    //         case 'Remove':

    //             break;
    //         default:
    //             throw new Error(`Unrecognized action: ${action}`);
    //     }
    // }
}