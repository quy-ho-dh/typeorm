import { ObjectID } from "../../../../../../src/driver/mongodb/typings";
export declare class Post {
    id: ObjectID;
    title: string;
    text: string;
}
export declare class PostWithDeleted {
    id: ObjectID;
    title: string;
    text: string;
    deletedAt: Date | null;
}
