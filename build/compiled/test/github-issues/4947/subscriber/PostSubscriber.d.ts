import { Post } from "../entity/Post";
import { EntitySubscriberInterface, UpdateEvent, InsertEvent } from "../../../../src";
export declare class PostSubscriber implements EntitySubscriberInterface<Post> {
    listenTo(): typeof Post;
    beforeUpdate(event: UpdateEvent<Post>): void;
    beforeInsert(event: InsertEvent<Post>): void;
}
