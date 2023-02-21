import { AnyEntity, Entity, BaseEntity as MikroBaseEntity, PrimaryKey, Property } from "@mikro-orm/core";
import { v1 } from 'uuid';

@Entity({abstract: true})
export default abstract class BaseEntity extends MikroBaseEntity<AnyEntity, 'id'> {

    @PrimaryKey()
        id: string;
    
    @Property({
        length: 6
    })
        createdAt: Date;

    @Property({
        onUpdate: () => new Date(),
        length: 6
    })
        updatedAt: Date;

    constructor(id: string = v1()) {
        super();
        this.id = id;
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }
}