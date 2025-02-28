"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const test_utils_1 = require("../../../utils/test-utils");
const Post_1 = require("./entity/Post");
const chai_1 = require("chai");
describe("transaction > nested transaction", () => {
    let connections;
    before(async () => (connections = await (0, test_utils_1.createTestingConnections)({
        entities: [__dirname + "/entity/*{.js,.ts}"],
    })));
    beforeEach(() => (0, test_utils_1.reloadTestingDatabases)(connections));
    after(() => (0, test_utils_1.closeTestingConnections)(connections));
    it("should execute operations based on conditions in deeply nested scenario", () => Promise.all(connections.map(async (connection) => {
        const conditions = [];
        // Spanner does not support nested transactions
        if (connection.driver.options.type === "spanner")
            return;
        await connection.manager.transaction(async (em0) => {
            const post = new Post_1.Post();
            post.title = "Post #1";
            await em0.save(post);
            conditions.push({ ...post, shouldExist: true });
            try {
                await em0.transaction(async (em1) => {
                    const post = new Post_1.Post();
                    post.title = "Post #2";
                    await em1.save(post);
                    conditions.push({ ...post, shouldExist: false });
                    await em1.transaction(async (em2) => {
                        const post = new Post_1.Post();
                        post.title = "Post #3";
                        await em2.save(post);
                        conditions.push({ ...post, shouldExist: false });
                    });
                    throw new Error("");
                });
            }
            catch (_) { }
            await em0.transaction(async (em1) => {
                const post = new Post_1.Post();
                post.title = "Post #4";
                await em1.save(post);
                conditions.push({ ...post, shouldExist: true });
            });
            await em0.transaction(async (em1) => {
                const post = new Post_1.Post();
                post.title = "Post #5";
                await em1.save(post);
                conditions.push({ ...post, shouldExist: true });
                try {
                    await em1.transaction(async (em2) => {
                        const post = new Post_1.Post();
                        post.title = "Post #6";
                        await em2.save(post);
                        conditions.push({ ...post, shouldExist: false });
                        await em2.transaction(async (em3) => {
                            const post = new Post_1.Post();
                            post.title = "Post #7";
                            await em3.save(post);
                            conditions.push({
                                ...post,
                                shouldExist: false,
                            });
                        });
                        throw new Error("");
                    });
                }
                catch (_) { }
                await em1.transaction(async (em2) => {
                    const post = new Post_1.Post();
                    post.title = "Post #8";
                    await em2.save(post);
                    conditions.push({ ...post, shouldExist: true });
                });
                await em1.transaction(async (em2) => {
                    const post = new Post_1.Post();
                    post.title = "Post #9";
                    await em2.save(post);
                    conditions.push({ ...post, shouldExist: true });
                    try {
                        await em2.transaction(async (em3) => {
                            const post = new Post_1.Post();
                            post.title = "Post #10";
                            await em3.save(post);
                            conditions.push({
                                ...post,
                                shouldExist: false,
                            });
                            await em3.transaction(async (em4) => {
                                const post = new Post_1.Post();
                                post.title = "Post #11";
                                await em4.save(post);
                                conditions.push({
                                    ...post,
                                    shouldExist: false,
                                });
                            });
                            throw new Error("");
                        });
                    }
                    catch (_) { }
                    await em2.transaction(async (em3) => {
                        const post = new Post_1.Post();
                        post.title = "Post #12";
                        await em3.save(post);
                        conditions.push({ ...post, shouldExist: true });
                    });
                });
            });
        });
        for (const condition of conditions) {
            const post = await connection.manager.findOne(Post_1.Post, {
                where: { title: condition.title },
            });
            if (condition.shouldExist) {
                (0, chai_1.expect)(post).not.to.be.null;
                post.should.be.eql({
                    id: condition.id,
                    title: condition.title,
                });
            }
            else {
                (0, chai_1.expect)(post).to.be.null;
            }
        }
    })));
    it("should fail operations when first transaction fails", () => Promise.all(connections.map(async (connection) => {
        const conditions = [];
        try {
            await connection.manager.transaction(async (em0) => {
                const post = new Post_1.Post();
                post.title = "Post #1";
                await em0.save(post);
                conditions.push({ ...post });
                try {
                    await em0.transaction(async (em1) => {
                        const post = new Post_1.Post();
                        post.title = "Post #2";
                        await em1.save(post);
                        conditions.push({ ...post });
                        throw new Error("");
                    });
                }
                catch (_) { }
                await em0.transaction(async (em1) => {
                    const post = new Post_1.Post();
                    post.title = "Post #3";
                    await em1.save(post);
                    conditions.push({ ...post });
                    try {
                        await em1.transaction(async (em2) => {
                            const post = new Post_1.Post();
                            post.title = "Post #4";
                            await em2.save(post);
                            conditions.push({ ...post });
                            throw new Error("");
                        });
                    }
                    catch (_) { }
                    await em1.transaction(async (em2) => {
                        const post = new Post_1.Post();
                        post.title = "Post #5";
                        await em2.save(post);
                        conditions.push({ ...post });
                        try {
                            await em2.transaction(async (em3) => {
                                const post = new Post_1.Post();
                                post.title = "Post #6";
                                await em3.save(post);
                                conditions.push({ ...post });
                                throw new Error("");
                            });
                        }
                        catch (_) { }
                    });
                });
                throw new Error("");
            });
        }
        catch (_) { }
        for (const condition of conditions) {
            const post = await connection.manager.findOne(Post_1.Post, {
                where: { title: condition.title },
            });
            (0, chai_1.expect)(post).to.be.null;
        }
    })));
});
//# sourceMappingURL=transaction-in-entity-manager.js.map