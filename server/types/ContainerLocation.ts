export enum ContainerArea {
    SHIP = 'SHIP',
    BUFFER = 'BUFFER'
}

export class ContainerLocation {

    static readonly SHIP_DIMENSIONS = {
        ROW_MAX: 8,
        COLUMN_MAX: 12
    }

    static readonly BUFFER_DIMENSIONS = { 
        ROW_MAX: 4,
        COLUMN_MAX: 24
    }

    x: number;
    y: number;
    area: ContainerArea;

    constructor(row: number, column: number, area: ContainerArea = ContainerArea.SHIP) {
        this.y = row;
        this.x = column;
        this.area = area;

        switch(area) {
            case ContainerArea.SHIP:
                if (
                    row < 1 || 
                    row > ContainerLocation.SHIP_DIMENSIONS.ROW_MAX || 
                    column < 1 || 
                    column > ContainerLocation.SHIP_DIMENSIONS.COLUMN_MAX
                ) 
                    throw new Error(`Invalid ${area} position: (${column},${row})`);
                break;
            case ContainerArea.BUFFER:
                if (
                    row < 1 || 
                    row > ContainerLocation.BUFFER_DIMENSIONS.ROW_MAX || 
                    column < 1 || 
                    column > ContainerLocation.BUFFER_DIMENSIONS.COLUMN_MAX
                ) 
                    throw new Error(`Invalid ${area} position: (${column},${row})`);
                break;
            default:
                throw new Error(`Unrecognized area type: ${area}`);
        }
    }
};