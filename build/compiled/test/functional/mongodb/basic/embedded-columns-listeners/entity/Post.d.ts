import { Counters } from "./Counters";
import { ObjectID } from "../../../../../../src/driver/mongodb/typings";
import { Tags } from "./Tags";
export declare class Post {
    id: ObjectID;
    title: string;
    text: string;
    counters?: Counters;
    tags?: Tags[];
}
