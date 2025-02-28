"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const test_utils_1 = require("../../utils/test-utils");
const Post_1 = require("./entity/Post");
describe("benchmark > bulk-save > case1", () => {
    let connections;
    before(async () => (connections = await (0, test_utils_1.createTestingConnections)({
        __dirname,
        enabledDrivers: ["postgres"],
    })));
    beforeEach(() => (0, test_utils_1.reloadTestingDatabases)(connections));
    after(() => (0, test_utils_1.closeTestingConnections)(connections));
    it("testing bulk save of 10.000 objects", () => Promise.all(connections.map(async (connection) => {
        const posts = [];
        for (let i = 1; i <= 10000; i++) {
            const post = new Post_1.Post();
            post.title = `Post #${i}`;
            post.text = `Post #${i} text`;
            post.likesCount = i;
            post.commentsCount = i;
            post.watchesCount = i;
            posts.push(post);
        }
        await connection.manager.save(posts);
        // await connection.manager.insert(Post, posts);
    })));
    /**
     * Before persistence refactoring
     *
     *  MySql
     *
     * √ testing bulk save of 1000 objects (2686ms)
     * √ testing bulk save of 1000 objects (1579ms)
     * √ testing bulk save of 1000 objects (1664ms)
     * √ testing bulk save of 1000 objects (1426ms)
     * √ testing bulk save of 1000 objects (1512ms)
     * √ testing bulk save of 1000 objects (1526ms)
     * √ testing bulk save of 1000 objects (1605ms)
     * √ testing bulk save of 1000 objects (1914ms)
     * √ testing bulk save of 1000 objects (1983ms)
     * √ testing bulk save of 1000 objects (1500ms)
     *
     * Postgres
     *
     * √ testing bulk save of 1000 objects (3704ms)
     * √ testing bulk save of 1000 objects (2080ms)
     * √ testing bulk save of 1000 objects (2176ms)
     * √ testing bulk save of 1000 objects (2447ms)
     * √ testing bulk save of 1000 objects (2259ms)
     * √ testing bulk save of 1000 objects (2112ms)
     * √ testing bulk save of 1000 objects (2193ms)
     * √ testing bulk save of 1000 objects (2211ms)
     * √ testing bulk save of 1000 objects (2282ms)
     * √ testing bulk save of 1000 objects (2551ms)
     *
     * SqlServer
     *
     * √ testing bulk save of 1000 objects (8098ms)
     * √ testing bulk save of 1000 objects (6534ms)
     * √ testing bulk save of 1000 objects (5789ms)
     * √ testing bulk save of 1000 objects (5505ms)
     * √ testing bulk save of 1000 objects (5813ms)
     * √ testing bulk save of 1000 objects (5932ms)
     * √ testing bulk save of 1000 objects (6114ms)
     * √ testing bulk save of 1000 objects (5960ms)
     * √ testing bulk save of 1000 objects (5755ms)
     * √ testing bulk save of 1000 objects (5935ms)
     */
});
//# sourceMappingURL=bulk-save-case1.js.map