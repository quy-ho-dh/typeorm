"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const chai_1 = require("chai");
const test_utils_1 = require("../../utils/test-utils");
const Post_1 = require("./entity/Post");
const src_1 = require("../../../src");
describe("github issues > #1997 enum type not working in postgres when defined in a custom schema", () => {
    let connections;
    before(async () => (connections = await (0, test_utils_1.createTestingConnections)({
        entities: [__dirname + "/entity/*{.js,.ts}"],
        enabledDrivers: ["postgres"],
    })));
    beforeEach(() => {
        return Promise.all(connections.map(async (connection) => {
            const queryRunner = connection.createQueryRunner();
            await queryRunner.dropSchema("schema", true, true);
            await queryRunner.createSchema("schema");
            await queryRunner.release();
        }));
    });
    afterEach(() => {
        return Promise.all(connections.map(async (connection) => {
            const queryRunner = connection.createQueryRunner();
            await queryRunner.dropSchema("schema", true, true);
            await queryRunner.release();
        }));
    });
    after(() => (0, test_utils_1.closeTestingConnections)(connections));
    it("should create table with ENUM column", () => Promise.all(connections.map(async (connection) => {
        await connection.driver.createSchemaBuilder().build();
    })));
    it("should be able to read table data with ENUM", () => Promise.all(connections.map(async (connection) => {
        await connection.driver.createSchemaBuilder().build();
        const queryRunner = connection.createQueryRunner();
        const table = await queryRunner.getTable("schema.post");
        table.should.not.be.undefined;
        await queryRunner.release();
    })));
    it("should save data with ENUM", () => Promise.all(connections.map(async (connection) => {
        await connection.driver.createSchemaBuilder().build();
        const postRepository = connection.getRepository(Post_1.Post);
        const queryRunner = connection.createQueryRunner();
        const table = await queryRunner.getTable("schema.post");
        await queryRunner.release();
        const post = new Post_1.Post();
        post.enum = "A";
        post.name = "Post #1";
        await postRepository.save(post);
        const loadedPost = (await postRepository.findOneBy({ id: 1 }));
        loadedPost.enum.should.be.equal(post.enum);
        table.findColumnByName("enum").type.should.be.equal("enum");
    })));
    it("should create ENUM column and revert creation", () => Promise.all(connections.map(async (connection) => {
        await connection.driver.createSchemaBuilder().build();
        const queryRunner = connection.createQueryRunner();
        await queryRunner.addColumn("schema.post", new src_1.TableColumn({
            name: "newEnum",
            type: "enum",
            enum: ["Apple", "Pineapple"],
        }));
        let table = await queryRunner.getTable("schema.post");
        table.findColumnByName("newEnum").type.should.be.equal("enum");
        await queryRunner.executeMemoryDownSql();
        table = await queryRunner.getTable("schema.post");
        (0, chai_1.expect)(table.findColumnByName("newEnum")).to.be.undefined;
        await queryRunner.release();
    })));
    it("should drop ENUM column and revert drop", () => Promise.all(connections.map(async (connection) => {
        await connection.driver.createSchemaBuilder().build();
        const queryRunner = connection.createQueryRunner();
        let table = await queryRunner.getTable("schema.post");
        const enumColumn = table.findColumnByName("enum");
        await queryRunner.dropColumn(table, enumColumn);
        (0, chai_1.expect)(table.findColumnByName("enum")).to.be.undefined;
        await queryRunner.executeMemoryDownSql();
        table = await queryRunner.getTable("schema.post");
        table.findColumnByName("enum").type.should.be.equal("enum");
        await queryRunner.release();
    })));
    it("should create table with ENUM column and revert creation", () => Promise.all(connections.map(async (connection) => {
        await connection.driver.createSchemaBuilder().build();
        const queryRunner = connection.createQueryRunner();
        await queryRunner.createTable(new src_1.Table({
            name: "schema.question",
            columns: [
                {
                    name: "enum",
                    type: "enum",
                    enum: ["Apple", "Banana", "Cherry"],
                },
            ],
        }));
        let table = await queryRunner.getTable("schema.question");
        const enumColumn = table.findColumnByName("enum");
        enumColumn.type.should.be.equal("enum");
        enumColumn.enum.should.be.eql(["Apple", "Banana", "Cherry"]);
        await queryRunner.executeMemoryDownSql();
        table = await queryRunner.getTable("question");
        (0, chai_1.expect)(table).to.be.undefined;
        await queryRunner.release();
    })));
    it("should drop table with ENUM column and revert drop", () => Promise.all(connections.map(async (connection) => {
        await connection.driver.createSchemaBuilder().build();
        const queryRunner = connection.createQueryRunner();
        await queryRunner.dropTable("schema.post");
        let table = await queryRunner.getTable("schema.post");
        (0, chai_1.expect)(table).to.be.undefined;
        await queryRunner.executeMemoryDownSql();
        table = await queryRunner.getTable("schema.post");
        (0, chai_1.expect)(table).to.be.not.undefined;
        await queryRunner.release();
    })));
    it("should change non-enum column in to ENUM and revert change", () => Promise.all(connections.map(async (connection) => {
        await connection.driver.createSchemaBuilder().build();
        const queryRunner = connection.createQueryRunner();
        let table = await queryRunner.getTable("schema.post");
        let nameColumn = table.findColumnByName("name");
        let changedColumn = nameColumn.clone();
        changedColumn.type = "enum";
        changedColumn.enum = ["Apple", "Banana", "Cherry"];
        await queryRunner.changeColumn(table, nameColumn, changedColumn);
        table = await queryRunner.getTable("schema.post");
        changedColumn = table.findColumnByName("name");
        changedColumn.type.should.be.equal("enum");
        changedColumn.enum.should.be.eql(["Apple", "Banana", "Cherry"]);
        await queryRunner.executeMemoryDownSql();
        table = await queryRunner.getTable("schema.post");
        nameColumn = table.findColumnByName("name");
        nameColumn.type.should.be.equal("character varying");
        (0, chai_1.expect)(nameColumn.enum).to.be.undefined;
        await queryRunner.release();
    })));
    it("should change ENUM column in to non-enum and revert change", () => Promise.all(connections.map(async (connection) => {
        await connection.driver.createSchemaBuilder().build();
        const queryRunner = connection.createQueryRunner();
        let table = await queryRunner.getTable("schema.post");
        let enumColumn = table.findColumnByName("enum");
        let changedColumn = enumColumn.clone();
        changedColumn.type = "character varying";
        changedColumn.enum = undefined;
        await queryRunner.changeColumn(table, enumColumn, changedColumn);
        table = await queryRunner.getTable("schema.post");
        changedColumn = table.findColumnByName("enum");
        changedColumn.type.should.be.equal("character varying");
        (0, chai_1.expect)(changedColumn.enum).to.be.undefined;
        await queryRunner.executeMemoryDownSql();
        table = await queryRunner.getTable("schema.post");
        enumColumn = table.findColumnByName("enum");
        enumColumn.type.should.be.equal("enum");
        enumColumn.enum.should.be.eql(["A", "B", "C"]);
        await queryRunner.release();
    })));
    it("should change ENUM column and revert change", () => Promise.all(connections.map(async (connection) => {
        await connection.driver.createSchemaBuilder().build();
        const queryRunner = connection.createQueryRunner();
        let table = await queryRunner.getTable("schema.post");
        const enumColumn = table.findColumnByName("enum");
        const changedColumn = enumColumn.clone();
        changedColumn.enum = ["C", "D", "E"];
        await queryRunner.changeColumn(table, enumColumn, changedColumn);
        table = await queryRunner.getTable("schema.post");
        table
            .findColumnByName("enum")
            .enum.should.be.eql(["C", "D", "E"]);
        await queryRunner.executeMemoryDownSql();
        table = await queryRunner.getTable("schema.post");
        table
            .findColumnByName("enum")
            .enum.should.be.eql(["A", "B", "C"]);
        await queryRunner.release();
    })));
    it("should rename ENUM when column renamed and revert rename", () => Promise.all(connections.map(async (connection) => {
        await connection.driver.createSchemaBuilder().build();
        const queryRunner = connection.createQueryRunner();
        const table = await queryRunner.getTable("schema.post");
        const enumColumn = table.findColumnByName("enum");
        const changedColumn = enumColumn.clone();
        changedColumn.name = "enumerable";
        await queryRunner.changeColumn(table, enumColumn, changedColumn);
        let result = await queryRunner.query(`SELECT "n"."nspname", "t"."typname" FROM "pg_type" "t" ` +
            `INNER JOIN "pg_namespace" "n" ON "n"."oid" = "t"."typnamespace" ` +
            `WHERE "n"."nspname" = 'schema' AND "t"."typname" = 'post_enumerable_enum'`);
        result.length.should.be.equal(1);
        await queryRunner.executeMemoryDownSql();
        result = await queryRunner.query(`SELECT "n"."nspname", "t"."typname" FROM "pg_type" "t" ` +
            `INNER JOIN "pg_namespace" "n" ON "n"."oid" = "t"."typnamespace" ` +
            `WHERE "n"."nspname" = 'schema' AND "t"."typname" = 'post_enum_enum'`);
        result.length.should.be.equal(1);
        await queryRunner.release();
    })));
    it("should rename ENUM when table renamed and revert rename", () => Promise.all(connections.map(async (connection) => {
        await connection.driver.createSchemaBuilder().build();
        const queryRunner = connection.createQueryRunner();
        const table = await queryRunner.getTable("schema.post");
        await queryRunner.renameTable(table, "question");
        let result = await queryRunner.query(`SELECT "n"."nspname", "t"."typname" FROM "pg_type" "t" ` +
            `INNER JOIN "pg_namespace" "n" ON "n"."oid" = "t"."typnamespace" ` +
            `WHERE "n"."nspname" = 'schema' AND "t"."typname" = 'question_enum_enum'`);
        result.length.should.be.equal(1);
        await queryRunner.executeMemoryDownSql();
        result = await queryRunner.query(`SELECT "n"."nspname", "t"."typname" FROM "pg_type" "t" ` +
            `INNER JOIN "pg_namespace" "n" ON "n"."oid" = "t"."typnamespace" ` +
            `WHERE "n"."nspname" = 'schema' AND "t"."typname" = 'post_enum_enum'`);
        result.length.should.be.equal(1);
        await queryRunner.release();
    })));
});
//# sourceMappingURL=issue-1997.js.map