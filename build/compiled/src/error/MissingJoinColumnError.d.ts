import { EntityMetadata } from "../metadata/EntityMetadata";
import { RelationMetadata } from "../metadata/RelationMetadata";
import { TypeORMError } from "./TypeORMError";
export declare class MissingJoinColumnError extends TypeORMError {
    constructor(entityMetadata: EntityMetadata, relation: RelationMetadata);
}
