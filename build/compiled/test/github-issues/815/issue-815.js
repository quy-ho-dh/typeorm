"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const test_utils_1 = require("../../utils/test-utils");
const Post_1 = require("./entity/Post");
const Category_1 = require("./entity/Category");
const chai_1 = require("chai");
describe("github issues > #815 @RelationId properties are not updated after entity saving", () => {
    let connections;
    before(async () => (connections = await (0, test_utils_1.createTestingConnections)({
        entities: [__dirname + "/entity/*{.js,.ts}"],
    })));
    beforeEach(() => (0, test_utils_1.reloadTestingDatabases)(connections));
    after(() => (0, test_utils_1.closeTestingConnections)(connections));
    it("should work perfectly with many-to-one relation", () => Promise.all(connections.map(async (connection) => {
        const post = new Post_1.Post();
        post.title = "About relation id";
        await connection.manager.save(post);
        const category = new Category_1.Category();
        category.firstId = 2;
        category.secondId = 3;
        category.name = "relation-id-category";
        category.post = post;
        await connection.manager.save(category);
        (0, chai_1.expect)(post).to.be.eql({
            id: 1,
            title: "About relation id",
        });
        (0, chai_1.expect)(category).to.be.eql({
            firstId: 2,
            secondId: 3,
            name: "relation-id-category",
            post: {
                id: 1,
                title: "About relation id",
            },
            postId: 1,
        });
        category.post = null;
        await connection.manager.save(category);
        (0, chai_1.expect)(category).to.be.eql({
            firstId: 2,
            secondId: 3,
            name: "relation-id-category",
            post: null,
            postId: null,
        });
    })));
    it("should work perfectly with one-to-many relation", () => Promise.all(connections.map(async (connection) => {
        const category1 = new Category_1.Category();
        category1.firstId = 2;
        category1.secondId = 3;
        category1.name = "relation-id-category1";
        await connection.manager.save(category1);
        const category2 = new Category_1.Category();
        category2.firstId = 2;
        category2.secondId = 4;
        category2.name = "relation-id-category2";
        await connection.manager.save(category2);
        const post = new Post_1.Post();
        post.title = "About relation id";
        post.categories = [category1, category2];
        await connection.manager.save(post);
        (0, chai_1.expect)(category1).to.be.eql({
            firstId: 2,
            secondId: 3,
            name: "relation-id-category1",
        });
        (0, chai_1.expect)(category2).to.be.eql({
            firstId: 2,
            secondId: 4,
            name: "relation-id-category2",
        });
        (0, chai_1.expect)(post).to.be.eql({
            id: 1,
            title: "About relation id",
            categories: [
                {
                    firstId: 2,
                    secondId: 3,
                    name: "relation-id-category1",
                },
                {
                    firstId: 2,
                    secondId: 4,
                    name: "relation-id-category2",
                },
            ],
            categoryIds: [
                {
                    firstId: 2,
                    secondId: 3,
                },
                {
                    firstId: 2,
                    secondId: 4,
                },
            ],
        });
    })));
    it("should work perfectly with many-to-many relation", () => Promise.all(connections.map(async (connection) => {
        const post1 = new Post_1.Post();
        post1.title = "About relation id1";
        await connection.manager.save(post1);
        const post2 = new Post_1.Post();
        post2.title = "About relation id2";
        await connection.manager.save(post2);
        const category1 = new Category_1.Category();
        category1.firstId = 2;
        category1.secondId = 3;
        category1.manyPosts = [post1, post2];
        category1.name = "relation-id-category1";
        const category2 = new Category_1.Category();
        category2.firstId = 2;
        category2.secondId = 4;
        category2.name = "relation-id-category2";
        category2.manyPosts = [post2];
        await connection.manager.save([category1, category2]);
        (0, chai_1.expect)(post1).to.be.eql({
            id: 1,
            title: "About relation id1",
        });
        (0, chai_1.expect)(post2).to.be.eql({
            id: 2,
            title: "About relation id2",
        });
        (0, chai_1.expect)(category1).to.be.eql({
            firstId: 2,
            secondId: 3,
            name: "relation-id-category1",
            manyPosts: [
                {
                    id: 1,
                    title: "About relation id1",
                },
                {
                    id: 2,
                    title: "About relation id2",
                },
            ],
            manyPostIds: [1, 2],
        });
        (0, chai_1.expect)(category2).to.be.eql({
            firstId: 2,
            secondId: 4,
            name: "relation-id-category2",
            manyPosts: [
                {
                    id: 2,
                    title: "About relation id2",
                },
            ],
            manyPostIds: [2],
        });
    })));
    it("should work perfectly with many-to-many relation (inverse side)", () => Promise.all(connections.map(async (connection) => {
        const category1 = new Category_1.Category();
        category1.firstId = 2;
        category1.secondId = 3;
        category1.name = "relation-id-category1";
        await connection.manager.save(category1);
        const category2 = new Category_1.Category();
        category2.firstId = 2;
        category2.secondId = 4;
        category2.name = "relation-id-category2";
        await connection.manager.save(category2);
        const post = new Post_1.Post();
        post.title = "About relation id";
        post.manyCategories = [category1, category2];
        await connection.manager.save(post);
        (0, chai_1.expect)(category1).to.be.eql({
            firstId: 2,
            secondId: 3,
            name: "relation-id-category1",
        });
        (0, chai_1.expect)(category2).to.be.eql({
            firstId: 2,
            secondId: 4,
            name: "relation-id-category2",
        });
        (0, chai_1.expect)(post).to.be.eql({
            id: 1,
            title: "About relation id",
            manyCategories: [
                {
                    firstId: 2,
                    secondId: 3,
                    name: "relation-id-category1",
                },
                {
                    firstId: 2,
                    secondId: 4,
                    name: "relation-id-category2",
                },
            ],
            manyCategoryIds: [
                {
                    firstId: 2,
                    secondId: 3,
                },
                {
                    firstId: 2,
                    secondId: 4,
                },
            ],
        });
    })));
});
//# sourceMappingURL=issue-815.js.map