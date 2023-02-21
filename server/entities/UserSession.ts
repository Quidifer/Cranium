import { Entity, Property } from "@mikro-orm/core";
import BaseEntity from "./BaseEntity";

@Entity()
export default class UserSession extends BaseEntity {
    
    @Property()
        username: string;
    
    constructor(username: string) {
        super();
        this.username = username;
    }
}