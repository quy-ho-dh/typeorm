"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const chai_1 = require("chai");
const test_utils_1 = require("../../../utils/test-utils");
const Post_1 = require("./entity/Post");
describe("spatial-postgres", () => {
    let connections;
    before(async () => {
        connections = await (0, test_utils_1.createTestingConnections)({
            entities: [__dirname + "/entity/*{.js,.ts}"],
            enabledDrivers: ["postgres"],
        });
    });
    beforeEach(async () => {
        try {
            await (0, test_utils_1.reloadTestingDatabases)(connections);
        }
        catch (err) {
            console.warn(err.stack);
            throw err;
        }
    });
    after(async () => {
        try {
            await (0, test_utils_1.closeTestingConnections)(connections);
        }
        catch (err) {
            console.warn(err.stack);
            throw err;
        }
    });
    it("should create correct schema with Postgres' geometry type", () => Promise.all(connections.map(async (connection) => {
        const queryRunner = connection.createQueryRunner();
        const schema = await queryRunner.getTable("post");
        await queryRunner.release();
        (0, chai_1.expect)(schema).not.to.be.undefined;
        const pointColumn = schema.columns.find((tableColumn) => tableColumn.name === "point" &&
            tableColumn.type === "geometry");
        (0, chai_1.expect)(pointColumn).to.not.be.undefined;
        (0, chai_1.expect)(pointColumn.spatialFeatureType.toLowerCase()).to.equal("point");
        (0, chai_1.expect)(pointColumn.srid).to.equal(4326);
    })));
    it("should create correct schema with Postgres' geography type", () => Promise.all(connections.map(async (connection) => {
        const queryRunner = connection.createQueryRunner();
        const schema = await queryRunner.getTable("post");
        await queryRunner.release();
        (0, chai_1.expect)(schema).not.to.be.undefined;
        (0, chai_1.expect)(schema.columns.find((tableColumn) => tableColumn.name === "geog" &&
            tableColumn.type === "geography")).to.not.be.undefined;
    })));
    it("should create correct schema with Postgres' geometry indices", () => Promise.all(connections.map(async (connection) => {
        const queryRunner = connection.createQueryRunner();
        const schema = await queryRunner.getTable("post");
        await queryRunner.release();
        (0, chai_1.expect)(schema).not.to.be.undefined;
        (0, chai_1.expect)(schema.indices.find((tableIndex) => tableIndex.isSpatial === true &&
            tableIndex.columnNames.length === 1 &&
            tableIndex.columnNames[0] === "geom")).to.not.be.undefined;
    })));
    it("should persist geometry correctly", () => Promise.all(connections.map(async (connection) => {
        const geom = {
            type: "Point",
            coordinates: [0, 0],
        };
        const recordRepo = connection.getRepository(Post_1.Post);
        const post = new Post_1.Post();
        post.geom = geom;
        const persistedPost = await recordRepo.save(post);
        const foundPost = await recordRepo.findOne({
            where: {
                id: persistedPost.id,
            },
        });
        (0, chai_1.expect)(foundPost).to.exist;
        (0, chai_1.expect)(foundPost.geom).to.deep.equal(geom);
    })));
    it("should persist geography correctly", () => Promise.all(connections.map(async (connection) => {
        const geom = {
            type: "Point",
            coordinates: [0, 0],
        };
        const recordRepo = connection.getRepository(Post_1.Post);
        const post = new Post_1.Post();
        post.geog = geom;
        const persistedPost = await recordRepo.save(post);
        const foundPost = await recordRepo.findOne({
            where: {
                id: persistedPost.id,
            },
        });
        (0, chai_1.expect)(foundPost).to.exist;
        (0, chai_1.expect)(foundPost.geog).to.deep.equal(geom);
    })));
    it("should update geometry correctly", () => Promise.all(connections.map(async (connection) => {
        const geom = {
            type: "Point",
            coordinates: [0, 0],
        };
        const geom2 = {
            type: "Point",
            coordinates: [45, 45],
        };
        const recordRepo = connection.getRepository(Post_1.Post);
        const post = new Post_1.Post();
        post.geom = geom;
        const persistedPost = await recordRepo.save(post);
        await recordRepo.update({
            id: persistedPost.id,
        }, {
            geom: geom2,
        });
        const foundPost = await recordRepo.findOne({
            where: {
                id: persistedPost.id,
            },
        });
        (0, chai_1.expect)(foundPost).to.exist;
        (0, chai_1.expect)(foundPost.geom).to.deep.equal(geom2);
    })));
    it("should re-save geometry correctly", () => Promise.all(connections.map(async (connection) => {
        const geom = {
            type: "Point",
            coordinates: [0, 0],
        };
        const geom2 = {
            type: "Point",
            coordinates: [45, 45],
        };
        const recordRepo = connection.getRepository(Post_1.Post);
        const post = new Post_1.Post();
        post.geom = geom;
        const persistedPost = await recordRepo.save(post);
        persistedPost.geom = geom2;
        await recordRepo.save(persistedPost);
        const foundPost = await recordRepo.findOne({
            where: {
                id: persistedPost.id,
            },
        });
        (0, chai_1.expect)(foundPost).to.exist;
        (0, chai_1.expect)(foundPost.geom).to.deep.equal(geom2);
    })));
    it("should be able to order geometries by distance", () => Promise.all(connections.map(async (connection) => {
        const geoJson1 = {
            type: "Point",
            coordinates: [139.9341032213472, 36.80798008559315],
        };
        const geoJson2 = {
            type: "Point",
            coordinates: [139.933053, 36.805711],
        };
        const origin = {
            type: "Point",
            coordinates: [139.933227, 36.808005],
        };
        const post1 = new Post_1.Post();
        post1.geom = geoJson1;
        const post2 = new Post_1.Post();
        post2.geom = geoJson2;
        await connection.manager.save([post1, post2]);
        const posts1 = await connection.manager
            .createQueryBuilder(Post_1.Post, "post")
            .where("ST_Distance(post.geom, ST_GeomFromGeoJSON(:origin)) > 0")
            .orderBy({
            "ST_Distance(post.geom, ST_GeomFromGeoJSON(:origin))": {
                order: "ASC",
                nulls: "NULLS FIRST",
            },
        })
            .setParameters({ origin: JSON.stringify(origin) })
            .getMany();
        const posts2 = await connection.manager
            .createQueryBuilder(Post_1.Post, "post")
            .orderBy("ST_Distance(post.geom, ST_GeomFromGeoJSON(:origin))", "DESC")
            .setParameters({ origin: JSON.stringify(origin) })
            .getMany();
        (0, chai_1.expect)(posts1[0].id).to.be.equal(post1.id);
        (0, chai_1.expect)(posts2[0].id).to.be.equal(post2.id);
    })));
});
//# sourceMappingURL=spatial-postgres.js.map