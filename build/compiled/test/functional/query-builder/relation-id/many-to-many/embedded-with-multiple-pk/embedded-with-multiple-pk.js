"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const chai_1 = require("chai");
const test_utils_1 = require("../../../../../utils/test-utils");
const Post_1 = require("./entity/Post");
const Category_1 = require("./entity/Category");
const Counters_1 = require("./entity/Counters");
const User_1 = require("./entity/User");
const Subcounters_1 = require("./entity/Subcounters");
describe("query builder > relation-id > many-to-many > embedded-with-multiple-pk", () => {
    let connections;
    before(async () => (connections = await (0, test_utils_1.createTestingConnections)({
        entities: [__dirname + "/entity/*{.js,.ts}"],
    })));
    beforeEach(() => (0, test_utils_1.reloadTestingDatabases)(connections));
    after(() => (0, test_utils_1.closeTestingConnections)(connections));
    describe("owner side", () => {
        it("should load ids when loadRelationIdAndMap used on embedded table and each table have primary key", () => Promise.all(connections.map(async (connection) => {
            const user1 = new User_1.User();
            user1.id = 1;
            user1.name = "Alice";
            await connection.manager.save(user1);
            const user2 = new User_1.User();
            user2.id = 2;
            user2.name = "Bob";
            await connection.manager.save(user2);
            const user3 = new User_1.User();
            user3.id = 3;
            user3.name = "Clara";
            await connection.manager.save(user3);
            const category1 = new Category_1.Category();
            category1.id = 1;
            category1.name = "cars";
            await connection.manager.save(category1);
            const category2 = new Category_1.Category();
            category2.id = 2;
            category2.name = "BMW";
            await connection.manager.save(category2);
            const category3 = new Category_1.Category();
            category3.id = 3;
            category3.name = "airplanes";
            await connection.manager.save(category3);
            const category4 = new Category_1.Category();
            category4.id = 4;
            category4.name = "Boeing";
            await connection.manager.save(category4);
            const post1 = new Post_1.Post();
            post1.id = 1;
            post1.title = "About BMW";
            post1.counters = new Counters_1.Counters();
            post1.counters.code = 111;
            post1.counters.likes = 1;
            post1.counters.comments = 2;
            post1.counters.favorites = 3;
            post1.counters.categories = [category1, category2];
            post1.counters.subcntrs = new Subcounters_1.Subcounters();
            post1.counters.subcntrs.version = 1;
            post1.counters.subcntrs.watches = 2;
            post1.counters.subcntrs.watchedUsers = [user1, user2];
            await connection.manager.save(post1);
            const post2 = new Post_1.Post();
            post2.id = 2;
            post2.title = "About Boeing";
            post2.counters = new Counters_1.Counters();
            post2.counters.code = 222;
            post2.counters.likes = 3;
            post2.counters.comments = 4;
            post2.counters.favorites = 5;
            post2.counters.categories = [category3, category4];
            post2.counters.subcntrs = new Subcounters_1.Subcounters();
            post2.counters.subcntrs.version = 1;
            post2.counters.subcntrs.watches = 1;
            post2.counters.subcntrs.watchedUsers = [user3];
            await connection.manager.save(post2);
            const loadedPosts = await connection.manager
                .createQueryBuilder(Post_1.Post, "post")
                .loadRelationIdAndMap("post.counters.categoryIds", "post.counters.categories")
                .loadRelationIdAndMap("post.counters.subcntrs.watchedUserIds", "post.counters.subcntrs.watchedUsers")
                .orderBy("post.id")
                .getMany();
            (0, chai_1.expect)(loadedPosts[0].should.be.eql({
                id: 1,
                title: "About BMW",
                counters: {
                    code: 111,
                    likes: 1,
                    comments: 2,
                    favorites: 3,
                    categoryIds: [
                        { id: 1, name: "cars" },
                        { id: 2, name: "BMW" },
                    ],
                    subcntrs: {
                        version: 1,
                        watches: 2,
                        watchedUserIds: [
                            { id: 1, name: "Alice" },
                            { id: 2, name: "Bob" },
                        ],
                    },
                },
            }));
            (0, chai_1.expect)(loadedPosts[1].should.be.eql({
                id: 2,
                title: "About Boeing",
                counters: {
                    code: 222,
                    likes: 3,
                    comments: 4,
                    favorites: 5,
                    categoryIds: [
                        { id: 3, name: "airplanes" },
                        { id: 4, name: "Boeing" },
                    ],
                    subcntrs: {
                        version: 1,
                        watches: 1,
                        watchedUserIds: [{ id: 3, name: "Clara" }],
                    },
                },
            }));
            const loadedPost = await connection.manager
                .createQueryBuilder(Post_1.Post, "post")
                .loadRelationIdAndMap("post.counters.categoryIds", "post.counters.categories")
                .loadRelationIdAndMap("post.counters.subcntrs.watchedUserIds", "post.counters.subcntrs.watchedUsers")
                .where("post.id = :id", { id: 1 })
                .andWhere("post.counters.code = :code", { code: 111 })
                .andWhere("post.counters.subcntrs.version = :version", {
                version: 1,
            })
                .getOne();
            (0, chai_1.expect)(loadedPost.should.be.eql({
                id: 1,
                title: "About BMW",
                counters: {
                    code: 111,
                    likes: 1,
                    comments: 2,
                    favorites: 3,
                    categoryIds: [
                        { id: 1, name: "cars" },
                        { id: 2, name: "BMW" },
                    ],
                    subcntrs: {
                        version: 1,
                        watches: 2,
                        watchedUserIds: [
                            { id: 1, name: "Alice" },
                            { id: 2, name: "Bob" },
                        ],
                    },
                },
            }));
        })));
    });
    describe("inverse side", () => {
        it("should load ids when loadRelationIdAndMap used on embedded table and each table have primary key", () => Promise.all(connections.map(async (connection) => {
            const post1 = new Post_1.Post();
            post1.id = 1;
            post1.title = "About BMW";
            post1.counters = new Counters_1.Counters();
            post1.counters.code = 111;
            post1.counters.likes = 1;
            post1.counters.comments = 2;
            post1.counters.favorites = 3;
            post1.counters.subcntrs = new Subcounters_1.Subcounters();
            post1.counters.subcntrs.version = 1;
            post1.counters.subcntrs.watches = 2;
            await connection.manager.save(post1);
            const post2 = new Post_1.Post();
            post2.id = 2;
            post2.title = "About Audi";
            post2.counters = new Counters_1.Counters();
            post2.counters.code = 222;
            post2.counters.likes = 3;
            post2.counters.comments = 4;
            post2.counters.favorites = 5;
            post2.counters.subcntrs = new Subcounters_1.Subcounters();
            post2.counters.subcntrs.version = 1;
            post2.counters.subcntrs.watches = 5;
            await connection.manager.save(post2);
            const post3 = new Post_1.Post();
            post3.id = 3;
            post3.title = "About Boeing";
            post3.counters = new Counters_1.Counters();
            post3.counters.code = 333;
            post3.counters.likes = 6;
            post3.counters.comments = 7;
            post3.counters.favorites = 8;
            post3.counters.subcntrs = new Subcounters_1.Subcounters();
            post3.counters.subcntrs.version = 2;
            post3.counters.subcntrs.watches = 10;
            await connection.manager.save(post3);
            const post4 = new Post_1.Post();
            post4.id = 4;
            post4.title = "About Airbus";
            post4.counters = new Counters_1.Counters();
            post4.counters.code = 444;
            post4.counters.likes = 9;
            post4.counters.comments = 10;
            post4.counters.favorites = 11;
            post4.counters.subcntrs = new Subcounters_1.Subcounters();
            post4.counters.subcntrs.version = 3;
            post4.counters.subcntrs.watches = 10;
            await connection.manager.save(post4);
            const category1 = new Category_1.Category();
            category1.id = 1;
            category1.name = "cars";
            category1.posts = [post1, post2];
            await connection.manager.save(category1);
            const category2 = new Category_1.Category();
            category2.id = 2;
            category2.name = "airplanes";
            category2.posts = [post3, post4];
            await connection.manager.save(category2);
            const user1 = new User_1.User();
            user1.id = 1;
            user1.name = "Alice";
            user1.posts = [post1, post2];
            await connection.manager.save(user1);
            const user2 = new User_1.User();
            user2.id = 2;
            user2.name = "Bob";
            user2.posts = [post3, post4];
            await connection.manager.save(user2);
            const loadedCategories = await connection.manager
                .createQueryBuilder(Category_1.Category, "category")
                .loadRelationIdAndMap("category.postIds", "category.posts")
                .orderBy("category.id")
                .getMany();
            (0, chai_1.expect)(loadedCategories[0].postIds).to.not.be.eql([]);
            (0, chai_1.expect)(loadedCategories[0].postIds.length).to.be.equal(2);
            (0, chai_1.expect)(loadedCategories[0].postIds[0]).to.be.eql({
                id: 1,
                counters: { code: 111, subcntrs: { version: 1 } },
            });
            (0, chai_1.expect)(loadedCategories[0].postIds[1]).to.be.eql({
                id: 2,
                counters: { code: 222, subcntrs: { version: 1 } },
            });
            (0, chai_1.expect)(loadedCategories[1].postIds).to.not.be.eql([]);
            (0, chai_1.expect)(loadedCategories[1].postIds.length).to.be.equal(2);
            (0, chai_1.expect)(loadedCategories[1].postIds[0]).to.be.eql({
                id: 3,
                counters: { code: 333, subcntrs: { version: 2 } },
            });
            (0, chai_1.expect)(loadedCategories[1].postIds[1]).to.be.eql({
                id: 4,
                counters: { code: 444, subcntrs: { version: 3 } },
            });
            const loadedCategory = await connection.manager
                .createQueryBuilder(Category_1.Category, "category")
                .loadRelationIdAndMap("category.postIds", "category.posts")
                .where("category.id = :id", { id: 1 })
                .andWhere("category.name = :name", { name: "cars" })
                .getOne();
            (0, chai_1.expect)(loadedCategory.postIds).to.not.be.eql([]);
            (0, chai_1.expect)(loadedCategory.postIds.length).to.be.equal(2);
            (0, chai_1.expect)(loadedCategory.postIds[0]).to.be.eql({
                id: 1,
                counters: { code: 111, subcntrs: { version: 1 } },
            });
            (0, chai_1.expect)(loadedCategory.postIds[1]).to.be.eql({
                id: 2,
                counters: { code: 222, subcntrs: { version: 1 } },
            });
            const loadedUsers = await connection.manager
                .createQueryBuilder(User_1.User, "user")
                .loadRelationIdAndMap("user.postIds", "user.posts")
                .orderBy("user.id")
                .getMany();
            (0, chai_1.expect)(loadedUsers[0].postIds).to.not.be.eql([]);
            (0, chai_1.expect)(loadedUsers[0].postIds.length).to.be.equal(2);
            (0, chai_1.expect)(loadedUsers[0].postIds[0]).to.be.eql({
                id: 1,
                counters: { code: 111, subcntrs: { version: 1 } },
            });
            (0, chai_1.expect)(loadedUsers[0].postIds[1]).to.be.eql({
                id: 2,
                counters: { code: 222, subcntrs: { version: 1 } },
            });
            (0, chai_1.expect)(loadedUsers[1].postIds).to.not.be.eql([]);
            (0, chai_1.expect)(loadedUsers[1].postIds.length).to.be.equal(2);
            (0, chai_1.expect)(loadedUsers[1].postIds[0]).to.be.eql({
                id: 3,
                counters: { code: 333, subcntrs: { version: 2 } },
            });
            (0, chai_1.expect)(loadedUsers[1].postIds[1]).to.be.eql({
                id: 4,
                counters: { code: 444, subcntrs: { version: 3 } },
            });
            const loadedUser = await connection.manager
                .createQueryBuilder(User_1.User, "user")
                .loadRelationIdAndMap("user.postIds", "user.posts")
                .where("user.id = :id", { id: 1 })
                .andWhere("user.name = :name", { name: "Alice" })
                .getOne();
            (0, chai_1.expect)(loadedUser.postIds).to.not.be.eql([]);
            (0, chai_1.expect)(loadedUser.postIds.length).to.be.equal(2);
            (0, chai_1.expect)(loadedUser.postIds[0]).to.be.eql({
                id: 1,
                counters: { code: 111, subcntrs: { version: 1 } },
            });
            (0, chai_1.expect)(loadedUser.postIds[1]).to.be.eql({
                id: 2,
                counters: { code: 222, subcntrs: { version: 1 } },
            });
        })));
    });
});
//# sourceMappingURL=embedded-with-multiple-pk.js.map