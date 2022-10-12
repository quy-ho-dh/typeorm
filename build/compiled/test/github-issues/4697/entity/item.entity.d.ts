import { ObjectID } from "../../../../src";
export declare class Item {
    _id: ObjectID;
    /**
     * @deprecated use contacts instead
     */
    contact?: string;
    contacts: Array<string>;
    config: any;
}
