"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const Post_1 = require("./entity/Post");
const Counters_1 = require("./entity/Counters");
const chai_1 = require("chai");
const test_utils_1 = require("../../../utils/test-utils");
const Subcounters_1 = require("./entity/Subcounters");
const User_1 = require("./entity/User");
describe("embedded > embedded-many-to-many-case5", () => {
    let connections;
    before(async () => (connections = await (0, test_utils_1.createTestingConnections)({
        entities: [__dirname + "/entity/*{.js,.ts}"],
    })));
    beforeEach(() => (0, test_utils_1.reloadTestingDatabases)(connections));
    after(() => (0, test_utils_1.closeTestingConnections)(connections));
    describe("owner side", () => {
        it("should insert, load, update and remove entities with embeddeds when embedded entity having ManyToMany relation with multiple primary keys (multiple keys in both sides)", () => Promise.all(connections.map(async (connection) => {
            const user1 = new User_1.User();
            user1.id = 1;
            user1.personId = 1;
            user1.name = "Alice";
            await connection.getRepository(User_1.User).save(user1);
            const user2 = new User_1.User();
            user2.id = 2;
            user2.personId = 2;
            user2.name = "Bob";
            await connection.getRepository(User_1.User).save(user2);
            const user3 = new User_1.User();
            user3.id = 3;
            user3.personId = 3;
            user3.name = "Clara";
            await connection.getRepository(User_1.User).save(user3);
            const post1 = new Post_1.Post();
            post1.id = 1;
            post1.title = "About cars";
            post1.counters = new Counters_1.Counters();
            post1.counters.code = 1;
            post1.counters.comments = 1;
            post1.counters.favorites = 2;
            post1.counters.likes = 3;
            post1.counters.likedUsers = [user1, user2];
            post1.counters.subcounters = new Subcounters_1.Subcounters();
            post1.counters.subcounters.version = 1;
            post1.counters.subcounters.watches = 5;
            await connection.getRepository(Post_1.Post).save(post1);
            const post2 = new Post_1.Post();
            post2.id = 2;
            post2.title = "About airplanes";
            post2.counters = new Counters_1.Counters();
            post2.counters.code = 2;
            post2.counters.comments = 2;
            post2.counters.favorites = 3;
            post2.counters.likes = 4;
            post2.counters.likedUsers = [user3];
            post2.counters.subcounters = new Subcounters_1.Subcounters();
            post2.counters.subcounters.version = 1;
            post2.counters.subcounters.watches = 10;
            await connection.getRepository(Post_1.Post).save(post2);
            let loadedPosts = await connection.manager
                .createQueryBuilder(Post_1.Post, "post")
                .leftJoinAndSelect("post.counters.likedUsers", "likedUser")
                .orderBy("post.id")
                .addOrderBy("likedUser.id")
                .getMany();
            (0, chai_1.expect)(loadedPosts[0].should.be.eql({
                id: 1,
                title: "About cars",
                counters: {
                    code: 1,
                    comments: 1,
                    favorites: 2,
                    likes: 3,
                    likedUsers: [
                        {
                            id: 1,
                            personId: 1,
                            name: "Alice",
                        },
                        {
                            id: 2,
                            personId: 2,
                            name: "Bob",
                        },
                    ],
                    subcounters: {
                        version: 1,
                        watches: 5,
                    },
                },
            }));
            (0, chai_1.expect)(loadedPosts[1].should.be.eql({
                id: 2,
                title: "About airplanes",
                counters: {
                    code: 2,
                    comments: 2,
                    favorites: 3,
                    likes: 4,
                    likedUsers: [
                        {
                            id: 3,
                            personId: 3,
                            name: "Clara",
                        },
                    ],
                    subcounters: {
                        version: 1,
                        watches: 10,
                    },
                },
            }));
            let loadedPost = await connection.manager
                .createQueryBuilder(Post_1.Post, "post")
                .leftJoinAndSelect("post.counters.likedUsers", "likedUser")
                .orderBy("likedUser.id")
                .where("post.id = :id", { id: 1 })
                .getOne();
            (0, chai_1.expect)(loadedPost.should.be.eql({
                id: 1,
                title: "About cars",
                counters: {
                    code: 1,
                    comments: 1,
                    favorites: 2,
                    likes: 3,
                    likedUsers: [
                        {
                            id: 1,
                            personId: 1,
                            name: "Alice",
                        },
                        {
                            id: 2,
                            personId: 2,
                            name: "Bob",
                        },
                    ],
                    subcounters: {
                        version: 1,
                        watches: 5,
                    },
                },
            }));
            loadedPost.counters.favorites += 1;
            loadedPost.counters.subcounters.watches += 1;
            loadedPost.counters.likedUsers = [user1];
            await connection.getRepository(Post_1.Post).save(loadedPost);
            loadedPost = await connection.manager
                .createQueryBuilder(Post_1.Post, "post")
                .leftJoinAndSelect("post.counters.likedUsers", "likedUser")
                .orderBy("likedUser.id")
                .where("post.id = :id", { id: 1 })
                .getOne();
            (0, chai_1.expect)(loadedPost.should.be.eql({
                id: 1,
                title: "About cars",
                counters: {
                    code: 1,
                    comments: 1,
                    favorites: 3,
                    likes: 3,
                    likedUsers: [
                        {
                            id: 1,
                            personId: 1,
                            name: "Alice",
                        },
                    ],
                    subcounters: {
                        version: 1,
                        watches: 6,
                    },
                },
            }));
            await connection.getRepository(Post_1.Post).remove(loadedPost);
            loadedPosts = (await connection.getRepository(Post_1.Post).find());
            (0, chai_1.expect)(loadedPosts.length).to.be.equal(1);
            (0, chai_1.expect)(loadedPosts[0].title).to.be.equal("About airplanes");
        })));
    });
    describe("inverse side", () => {
        it("should insert, load, update and remove entities with embeddeds when embedded entity having ManyToMany relation with multiple primary keys (multiple keys in both sides)", () => Promise.all(connections.map(async (connection) => {
            const post1 = new Post_1.Post();
            post1.id = 1;
            post1.title = "About cars";
            post1.counters = new Counters_1.Counters();
            post1.counters.code = 1;
            post1.counters.comments = 1;
            post1.counters.favorites = 2;
            post1.counters.likes = 3;
            post1.counters.subcounters = new Subcounters_1.Subcounters();
            post1.counters.subcounters.version = 1;
            post1.counters.subcounters.watches = 5;
            await connection.getRepository(Post_1.Post).save(post1);
            const post2 = new Post_1.Post();
            post2.id = 2;
            post2.title = "About airplanes";
            post2.counters = new Counters_1.Counters();
            post2.counters.code = 2;
            post2.counters.comments = 2;
            post2.counters.favorites = 3;
            post2.counters.likes = 4;
            post2.counters.subcounters = new Subcounters_1.Subcounters();
            post2.counters.subcounters.version = 1;
            post2.counters.subcounters.watches = 10;
            await connection.getRepository(Post_1.Post).save(post2);
            const user1 = new User_1.User();
            user1.id = 1;
            user1.personId = 1;
            user1.name = "Alice";
            user1.likedPosts = [post1, post2];
            await connection.getRepository(User_1.User).save(user1);
            const user2 = new User_1.User();
            user2.id = 2;
            user2.personId = 2;
            user2.name = "Bob";
            user2.likedPosts = [post1];
            await connection.getRepository(User_1.User).save(user2);
            const user3 = new User_1.User();
            user3.id = 3;
            user3.personId = 3;
            user3.name = "Clara";
            user3.likedPosts = [post2];
            await connection.getRepository(User_1.User).save(user3);
            let loadedUsers = await connection.manager
                .createQueryBuilder(User_1.User, "user")
                .leftJoinAndSelect("user.likedPosts", "likedPost")
                .orderBy("user.id")
                .addOrderBy("likedPost.id")
                .getMany();
            (0, chai_1.expect)(loadedUsers[0].should.be.eql({
                id: 1,
                personId: 1,
                name: "Alice",
                likedPosts: [
                    {
                        id: 1,
                        title: "About cars",
                        counters: {
                            code: 1,
                            comments: 1,
                            favorites: 2,
                            likes: 3,
                            subcounters: {
                                version: 1,
                                watches: 5,
                            },
                        },
                    },
                    {
                        id: 2,
                        title: "About airplanes",
                        counters: {
                            code: 2,
                            comments: 2,
                            favorites: 3,
                            likes: 4,
                            subcounters: {
                                version: 1,
                                watches: 10,
                            },
                        },
                    },
                ],
            }));
            (0, chai_1.expect)(loadedUsers[1].should.be.eql({
                id: 2,
                personId: 2,
                name: "Bob",
                likedPosts: [
                    {
                        id: 1,
                        title: "About cars",
                        counters: {
                            code: 1,
                            comments: 1,
                            favorites: 2,
                            likes: 3,
                            subcounters: {
                                version: 1,
                                watches: 5,
                            },
                        },
                    },
                ],
            }));
            (0, chai_1.expect)(loadedUsers[2].should.be.eql({
                id: 3,
                personId: 3,
                name: "Clara",
                likedPosts: [
                    {
                        id: 2,
                        title: "About airplanes",
                        counters: {
                            code: 2,
                            comments: 2,
                            favorites: 3,
                            likes: 4,
                            subcounters: {
                                version: 1,
                                watches: 10,
                            },
                        },
                    },
                ],
            }));
            let loadedUser = await connection.manager
                .createQueryBuilder(User_1.User, "user")
                .leftJoinAndSelect("user.likedPosts", "likedPost")
                .orderBy("likedPost.id")
                .where("user.id = :id", { id: 1 })
                .getOne();
            (0, chai_1.expect)(loadedUser.should.be.eql({
                id: 1,
                personId: 1,
                name: "Alice",
                likedPosts: [
                    {
                        id: 1,
                        title: "About cars",
                        counters: {
                            code: 1,
                            comments: 1,
                            favorites: 2,
                            likes: 3,
                            subcounters: {
                                version: 1,
                                watches: 5,
                            },
                        },
                    },
                    {
                        id: 2,
                        title: "About airplanes",
                        counters: {
                            code: 2,
                            comments: 2,
                            favorites: 3,
                            likes: 4,
                            subcounters: {
                                version: 1,
                                watches: 10,
                            },
                        },
                    },
                ],
            }));
            loadedUser.name = "Anna";
            loadedUser.likedPosts = [post1];
            await connection.getRepository(User_1.User).save(loadedUser);
            loadedUser = await connection.manager
                .createQueryBuilder(User_1.User, "user")
                .leftJoinAndSelect("user.likedPosts", "likedPost")
                .orderBy("likedPost.id")
                .where("user.id = :id", { id: 1 })
                .getOne();
            (0, chai_1.expect)(loadedUser.should.be.eql({
                id: 1,
                personId: 1,
                name: "Anna",
                likedPosts: [
                    {
                        id: 1,
                        title: "About cars",
                        counters: {
                            code: 1,
                            comments: 1,
                            favorites: 2,
                            likes: 3,
                            subcounters: {
                                version: 1,
                                watches: 5,
                            },
                        },
                    },
                ],
            }));
            await connection.getRepository(User_1.User).remove(loadedUser);
            loadedUsers = (await connection
                .getRepository(User_1.User)
                .find({ order: { name: "ASC" } }));
            (0, chai_1.expect)(loadedUsers.length).to.be.equal(2);
            (0, chai_1.expect)(loadedUsers[0].name).to.be.equal("Bob");
            (0, chai_1.expect)(loadedUsers[1].name).to.be.equal("Clara");
        })));
    });
});
//# sourceMappingURL=embedded-many-to-many-case5.js.map