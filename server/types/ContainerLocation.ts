enum ContainerArea {
    SHIP = 'SHIP',
    BUFFER = 'BUFFER'
}

type ContainerLocation = {
    x: number;
    y: number;
    area: ContainerArea;
}

export type { ContainerArea };
export type { ContainerLocation };