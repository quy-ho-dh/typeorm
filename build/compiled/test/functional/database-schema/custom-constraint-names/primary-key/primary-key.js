"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const chai_1 = require("chai");
const test_utils_1 = require("../../../../utils/test-utils");
const Post_1 = require("./entity/Post");
const User_1 = require("./entity/User");
describe("database schema > custom constraint names > primary key", () => {
    let dataSources;
    before(async () => (dataSources = await (0, test_utils_1.createTestingConnections)({
        entities: [__dirname + "/entity/*{.js,.ts}"],
        enabledDrivers: ["postgres", "cockroachdb", "mssql", "oracle"],
    })));
    beforeEach(() => (0, test_utils_1.reloadTestingDatabases)(dataSources));
    after(() => (0, test_utils_1.closeTestingConnections)(dataSources));
    it("should set custom constraint names", () => Promise.all(dataSources.map(async (dataSource) => {
        let post = dataSource.getMetadata(Post_1.Post);
        let user = dataSource.getMetadata(User_1.User);
        const idPK = user.primaryColumns.find((it) => it.primaryKeyConstraintName === "PK_ID");
        const namePK = post.primaryColumns.find((it) => it.primaryKeyConstraintName === "PK_NAME_HEADER");
        const headerPK = post.primaryColumns.find((it) => it.primaryKeyConstraintName === "PK_NAME_HEADER");
        (0, chai_1.expect)(idPK).to.exist;
        (0, chai_1.expect)(namePK).to.exist;
        (0, chai_1.expect)(headerPK).to.exist;
    })));
    it("should load constraints with custom names", () => Promise.all(dataSources.map(async (dataSource) => {
        const queryRunner = dataSource.createQueryRunner();
        const postTable = await queryRunner.getTable("post");
        const userTable = await queryRunner.getTable("user");
        await queryRunner.release();
        const idPK = userTable.primaryColumns.find((it) => it.primaryKeyConstraintName === "PK_ID");
        const namePK = postTable.primaryColumns.find((it) => it.primaryKeyConstraintName === "PK_NAME_HEADER");
        const headerPK = postTable.primaryColumns.find((it) => it.primaryKeyConstraintName === "PK_NAME_HEADER");
        (0, chai_1.expect)(idPK).to.exist;
        (0, chai_1.expect)(namePK).to.exist;
        (0, chai_1.expect)(headerPK).to.exist;
    })));
    it("should not change constraint names when table renamed", () => Promise.all(dataSources.map(async (dataSource) => {
        const queryRunner = dataSource.createQueryRunner();
        await queryRunner.renameTable("post", "post_renamed");
        await queryRunner.renameTable("user", "user_renamed");
        const postTable = await queryRunner.getTable("post_renamed");
        const userTable = await queryRunner.getTable("user_renamed");
        await queryRunner.release();
        const idPK = userTable.primaryColumns.find((it) => it.primaryKeyConstraintName === "PK_ID");
        const namePK = postTable.primaryColumns.find((it) => it.primaryKeyConstraintName === "PK_NAME_HEADER");
        const headerPK = postTable.primaryColumns.find((it) => it.primaryKeyConstraintName === "PK_NAME_HEADER");
        (0, chai_1.expect)(idPK).to.exist;
        (0, chai_1.expect)(namePK).to.exist;
        (0, chai_1.expect)(headerPK).to.exist;
    })));
    it("should not change constraint names when column renamed", () => Promise.all(dataSources.map(async (dataSource) => {
        const queryRunner = dataSource.createQueryRunner();
        let table = await queryRunner.getTable("post");
        const nameColumn = table.findColumnByName("name");
        const changedNameColumn = nameColumn.clone();
        changedNameColumn.name = "name_renamed";
        await queryRunner.changeColumns(table, [
            {
                oldColumn: nameColumn,
                newColumn: changedNameColumn,
            },
        ]);
        table = await queryRunner.getTable("post");
        await queryRunner.release();
        const namePK = table.primaryColumns.find((it) => it.primaryKeyConstraintName === "PK_NAME_HEADER");
        const headerPK = table.primaryColumns.find((it) => it.primaryKeyConstraintName === "PK_NAME_HEADER");
        (0, chai_1.expect)(namePK).to.exist;
        (0, chai_1.expect)(headerPK).to.exist;
    })));
});
//# sourceMappingURL=primary-key.js.map