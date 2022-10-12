import { EntitySchema } from "../../../../src";
import { Team } from "./TeamEntity";
export declare type User = {
    id: number;
    teams: Team[];
};
export declare const UserEntity: EntitySchema<User>;
