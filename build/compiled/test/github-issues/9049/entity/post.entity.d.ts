import { ObjectID } from "../../../../src/driver/mongodb/typings";
import { Comment } from "./comment";
export declare class Post {
    _id?: ObjectID;
    comments: Comment[];
}
