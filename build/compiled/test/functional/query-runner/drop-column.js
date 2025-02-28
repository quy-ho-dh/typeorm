"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const chai_1 = require("chai");
const test_utils_1 = require("../../utils/test-utils");
describe("query runner > drop column", () => {
    let connections;
    before(async () => {
        connections = await (0, test_utils_1.createTestingConnections)({
            entities: [__dirname + "/entity/*{.js,.ts}"],
            schemaCreate: true,
            dropSchema: true,
        });
    });
    after(() => (0, test_utils_1.closeTestingConnections)(connections));
    describe("when columns are instances of TableColumn", () => {
        it("should correctly drop column and revert drop", () => Promise.all(connections.map(async (connection) => {
            const queryRunner = connection.createQueryRunner();
            let table = await queryRunner.getTable("post");
            const idColumn = table.findColumnByName("id");
            const nameColumn = table.findColumnByName("name");
            const versionColumn = table.findColumnByName("version");
            idColumn.should.be.exist;
            nameColumn.should.be.exist;
            versionColumn.should.be.exist;
            // better-sqlite3 seems not able to create a check constraint on a non-existing column
            if (connection.name === "better-sqlite3") {
                await queryRunner.dropCheckConstraints(table, table.checks);
            }
            // In Sqlite 'dropColumns' method is more optimal than 'dropColumn', because it recreate table just once,
            // without all removed columns. In other drivers it's no difference between these methods, because 'dropColumns'
            // calls 'dropColumn' method for each removed column.
            // CockroachDB and Spanner does not support changing pk.
            if (connection.driver.options.type === "cockroachdb" ||
                connection.driver.options.type === "spanner") {
                await queryRunner.dropColumns(table, [
                    nameColumn,
                    versionColumn,
                ]);
            }
            else {
                await queryRunner.dropColumns(table, [
                    idColumn,
                    nameColumn,
                    versionColumn,
                ]);
            }
            table = await queryRunner.getTable("post");
            (0, chai_1.expect)(table.findColumnByName("name")).to.be.undefined;
            (0, chai_1.expect)(table.findColumnByName("version")).to.be.undefined;
            if (!(connection.driver.options.type === "cockroachdb" ||
                connection.driver.options.type === "spanner"))
                (0, chai_1.expect)(table.findColumnByName("id")).to.be.undefined;
            await queryRunner.executeMemoryDownSql();
            table = await queryRunner.getTable("post");
            table.findColumnByName("id").should.be.exist;
            table.findColumnByName("name").should.be.exist;
            table.findColumnByName("version").should.be.exist;
            await queryRunner.release();
        })));
    });
    describe("when columns are strings", () => {
        it("should correctly drop column and revert drop", () => Promise.all(connections.map(async (connection) => {
            const queryRunner = connection.createQueryRunner();
            let table = await queryRunner.getTable("post");
            const idColumn = table.findColumnByName("id");
            const nameColumn = table.findColumnByName("name");
            const versionColumn = table.findColumnByName("version");
            idColumn.should.be.exist;
            nameColumn.should.be.exist;
            versionColumn.should.be.exist;
            // better-sqlite3 seems not able to create a check constraint on a non-existing column
            if (connection.name === "better-sqlite3") {
                await queryRunner.dropCheckConstraints(table, table.checks);
            }
            // In Sqlite 'dropColumns' method is more optimal than 'dropColumn', because it recreate table just once,
            // without all removed columns. In other drivers it's no difference between these methods, because 'dropColumns'
            // calls 'dropColumn' method for each removed column.
            // CockroachDB does not support changing pk.
            if (connection.driver.options.type === "cockroachdb" ||
                connection.driver.options.type === "spanner") {
                await queryRunner.dropColumns(table, [
                    "name",
                    "version",
                ]);
            }
            else {
                await queryRunner.dropColumns(table, [
                    "id",
                    "name",
                    "version",
                ]);
            }
            table = await queryRunner.getTable("post");
            (0, chai_1.expect)(table.findColumnByName("name")).to.be.undefined;
            (0, chai_1.expect)(table.findColumnByName("version")).to.be.undefined;
            if (!(connection.driver.options.type === "cockroachdb" ||
                connection.driver.options.type === "spanner"))
                (0, chai_1.expect)(table.findColumnByName("id")).to.be.undefined;
            await queryRunner.executeMemoryDownSql();
            table = await queryRunner.getTable("post");
            table.findColumnByName("id").should.be.exist;
            table.findColumnByName("name").should.be.exist;
            table.findColumnByName("version").should.be.exist;
            await queryRunner.release();
        })));
    });
});
//# sourceMappingURL=drop-column.js.map