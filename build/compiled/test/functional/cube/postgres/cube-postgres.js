"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const chai_1 = require("chai");
const test_utils_1 = require("../../../utils/test-utils");
const Post_1 = require("./entity/Post");
describe("cube-postgres", () => {
    let connections;
    before(async () => {
        connections = await (0, test_utils_1.createTestingConnections)({
            entities: [__dirname + "/entity/*{.js,.ts}"],
            enabledDrivers: ["postgres"],
        });
    });
    beforeEach(() => (0, test_utils_1.reloadTestingDatabases)(connections));
    after(() => (0, test_utils_1.closeTestingConnections)(connections));
    it("should create correct schema with Postgres' cube type", () => Promise.all(connections.map(async (connection) => {
        const queryRunner = connection.createQueryRunner();
        const schema = await queryRunner.getTable("post");
        await queryRunner.release();
        (0, chai_1.expect)(schema).not.to.be.undefined;
        const cubeColumn = schema.columns.find((tableColumn) => tableColumn.name === "mainColor" &&
            tableColumn.type === "cube" &&
            !tableColumn.isArray);
        (0, chai_1.expect)(cubeColumn).to.not.be.undefined;
        const cubeArrayColumn = schema.columns.find((tableColumn) => tableColumn.name === "colors" &&
            tableColumn.type === "cube" &&
            tableColumn.isArray);
        (0, chai_1.expect)(cubeArrayColumn).to.not.be.undefined;
    })));
    it("should persist cube correctly", () => Promise.all(connections.map(async (connection) => {
        const color = [255, 0, 0];
        const postRepo = connection.getRepository(Post_1.Post);
        const post = new Post_1.Post();
        post.mainColor = color;
        const persistedPost = await postRepo.save(post);
        const foundPost = await postRepo.findOneBy({
            id: persistedPost.id,
        });
        (0, chai_1.expect)(foundPost).to.exist;
        (0, chai_1.expect)(foundPost.mainColor).to.deep.equal(color);
    })));
    it("should update cube correctly", () => Promise.all(connections.map(async (connection) => {
        const color = [255, 0, 0];
        const color2 = [0, 255, 0];
        const postRepo = connection.getRepository(Post_1.Post);
        const post = new Post_1.Post();
        post.mainColor = color;
        const persistedPost = await postRepo.save(post);
        await postRepo.update({ id: persistedPost.id }, { mainColor: color2 });
        const foundPost = await postRepo.findOneBy({
            id: persistedPost.id,
        });
        (0, chai_1.expect)(foundPost).to.exist;
        (0, chai_1.expect)(foundPost.mainColor).to.deep.equal(color2);
    })));
    it("should re-save cube correctly", () => Promise.all(connections.map(async (connection) => {
        const color = [255, 0, 0];
        const color2 = [0, 255, 0];
        const postRepo = connection.getRepository(Post_1.Post);
        const post = new Post_1.Post();
        post.mainColor = color;
        const persistedPost = await postRepo.save(post);
        persistedPost.mainColor = color2;
        await postRepo.save(persistedPost);
        const foundPost = await postRepo.findOneBy({
            id: persistedPost.id,
        });
        (0, chai_1.expect)(foundPost).to.exist;
        (0, chai_1.expect)(foundPost.mainColor).to.deep.equal(color2);
    })));
    it("should persist cube of arity 0 correctly", () => Promise.all(connections.map(async (connection) => {
        // Get Postgres version because zero-length cubes are not legal
        // on all Postgres versions. Zero-length cubes are only tested
        // to be working on Postgres version >=10.6.
        const [{ version }] = await connection.query("SELECT version()");
        const semverArray = version
            .replace(/^PostgreSQL ([\d\.]+) .*$/, "$1")
            .split(".")
            .map(Number);
        if (!(semverArray[0] >= 10 && semverArray[1] >= 6)) {
            return;
        }
        const color = [];
        const postRepo = connection.getRepository(Post_1.Post);
        const post = new Post_1.Post();
        post.mainColor = color;
        const persistedPost = await postRepo.save(post);
        const foundPost = await postRepo.findOneBy({
            id: persistedPost.id,
        });
        (0, chai_1.expect)(foundPost).to.exist;
        (0, chai_1.expect)(foundPost.mainColor).to.deep.equal(color);
    })));
    it("should be able to order cube by euclidean distance", () => Promise.all(connections.map(async (connection) => {
        const color1 = [255, 0, 0];
        const color2 = [255, 255, 0];
        const color3 = [255, 255, 255];
        const post1 = new Post_1.Post();
        post1.mainColor = color1;
        const post2 = new Post_1.Post();
        post2.mainColor = color2;
        const post3 = new Post_1.Post();
        post3.mainColor = color3;
        await connection.manager.save([post1, post2, post3]);
        const posts = await connection.manager
            .createQueryBuilder(Post_1.Post, "post")
            .orderBy("\"mainColor\" <-> '(0, 255, 0)'", "DESC")
            .getMany();
        const postIds = posts.map((post) => post.id);
        (0, chai_1.expect)(postIds).to.deep.equal([post1.id, post3.id, post2.id]);
    })));
    it("should persist cube array correctly", () => Promise.all(connections.map(async (connection) => {
        const colors = [
            [255, 0, 0],
            [255, 255, 0],
        ];
        const postRepo = connection.getRepository(Post_1.Post);
        const post = new Post_1.Post();
        post.colors = colors;
        const persistedPost = await postRepo.save(post);
        const foundPost = await postRepo.findOneBy({
            id: persistedPost.id,
        });
        (0, chai_1.expect)(foundPost).to.exist;
        (0, chai_1.expect)(foundPost.colors).to.deep.equal(colors);
    })));
});
//# sourceMappingURL=cube-postgres.js.map