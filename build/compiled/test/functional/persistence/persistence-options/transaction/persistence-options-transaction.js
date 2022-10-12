"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const test_utils_1 = require("../../../../utils/test-utils");
const Post_1 = require("./entity/Post");
// import {expect} from "chai";
describe("persistence > persistence options > transaction", () => {
    // -------------------------------------------------------------------------
    // Configuration
    // -------------------------------------------------------------------------
    let connections;
    before(async () => (connections = await (0, test_utils_1.createTestingConnections)({ __dirname })));
    beforeEach(() => (0, test_utils_1.reloadTestingDatabases)(connections));
    after(() => (0, test_utils_1.closeTestingConnections)(connections));
    // -------------------------------------------------------------------------
    // Specifications
    // -------------------------------------------------------------------------
    it("should disable transaction when option is specified", () => Promise.all(connections.map(async (connection) => {
        const post = new Post_1.Post();
        post.title = "Bakhrom";
        post.description = "Hello";
        await connection.manager.save(post, { transaction: false });
        // todo: check if actual transaction query is not executed
    })));
});
//# sourceMappingURL=persistence-options-transaction.js.map