"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const test_utils_1 = require("../../../../utils/test-utils");
const User_1 = require("./entity/User");
const Profile_1 = require("./entity/Profile");
const Editor_1 = require("./entity/Editor");
const Post_1 = require("./entity/Post");
const Category_1 = require("./entity/Category");
describe("relations > eager relations > basic", () => {
    let connections;
    before(async () => (connections = await (0, test_utils_1.createTestingConnections)({
        entities: [__dirname + "/entity/*{.js,.ts}"],
    })));
    beforeEach(() => (0, test_utils_1.reloadTestingDatabases)(connections));
    after(() => (0, test_utils_1.closeTestingConnections)(connections));
    async function prepareData(connection) {
        const profile = new Profile_1.Profile();
        profile.about = "I cut trees!";
        await connection.manager.save(profile);
        const user = new User_1.User();
        user.firstName = "Timber";
        user.lastName = "Saw";
        user.profile = profile;
        await connection.manager.save(user);
        const primaryCategory1 = new Category_1.Category();
        primaryCategory1.name = "primary category #1";
        await connection.manager.save(primaryCategory1);
        const primaryCategory2 = new Category_1.Category();
        primaryCategory2.name = "primary category #2";
        await connection.manager.save(primaryCategory2);
        const secondaryCategory1 = new Category_1.Category();
        secondaryCategory1.name = "secondary category #1";
        await connection.manager.save(secondaryCategory1);
        const secondaryCategory2 = new Category_1.Category();
        secondaryCategory2.name = "secondary category #2";
        await connection.manager.save(secondaryCategory2);
        const post = new Post_1.Post();
        post.title = "about eager relations";
        post.categories1 = [primaryCategory1, primaryCategory2];
        post.categories2 = [secondaryCategory1, secondaryCategory2];
        post.author = user;
        await connection.manager.save(post);
        const editor = new Editor_1.Editor();
        editor.post = post;
        editor.user = user;
        await connection.manager.save(editor);
    }
    it("should load all eager relations when object is loaded", () => Promise.all(connections.map(async (connection) => {
        await prepareData(connection);
        const loadedPost = await connection.manager.findOne(Post_1.Post, {
            where: {
                id: 1,
            },
        });
        // sort arrays because some drivers returns arrays in wrong order, e.g. categoryIds: [2, 1]
        loadedPost.categories1.sort((a, b) => a.id - b.id);
        loadedPost.categories2.sort((a, b) => a.id - b.id);
        loadedPost.should.be.eql({
            id: 1,
            title: "about eager relations",
            categories1: [
                {
                    id: 1,
                    name: "primary category #1",
                },
                {
                    id: 2,
                    name: "primary category #2",
                },
            ],
            categories2: [
                {
                    id: 3,
                    name: "secondary category #1",
                },
                {
                    id: 4,
                    name: "secondary category #2",
                },
            ],
            author: {
                id: 1,
                firstName: "Timber",
                lastName: "Saw",
                profile: {
                    id: 1,
                    about: "I cut trees!",
                },
            },
            editors: [
                {
                    userId: 1,
                    postId: 1,
                    user: {
                        id: 1,
                        firstName: "Timber",
                        lastName: "Saw",
                        profile: {
                            id: 1,
                            about: "I cut trees!",
                        },
                    },
                },
            ],
        });
    })));
    it("should not load eager relations when query builder is used", () => Promise.all(connections.map(async (connection) => {
        await prepareData(connection);
        const loadedPost = await connection.manager
            .createQueryBuilder(Post_1.Post, "post")
            .where("post.id = :id", { id: 1 })
            .getOne();
        loadedPost.should.be.eql({
            id: 1,
            title: "about eager relations",
        });
    })));
});
//# sourceMappingURL=basic-eager-relations.js.map