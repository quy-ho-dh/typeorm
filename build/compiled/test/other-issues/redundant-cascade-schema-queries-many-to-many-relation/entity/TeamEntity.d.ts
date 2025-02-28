import { EntitySchema } from "../../../../src";
import { User } from "./UserEntity";
export declare type Team = {
    id: number;
    users: User[];
};
export declare const TeamEntity: EntitySchema<Team>;
