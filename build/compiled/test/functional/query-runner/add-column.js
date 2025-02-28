"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
require("reflect-metadata");
const TableColumn_1 = require("../../../src/schema-builder/table/TableColumn");
const test_utils_1 = require("../../utils/test-utils");
const DriverUtils_1 = require("../../../src/driver/DriverUtils");
describe("query runner > add column", () => {
    let connections;
    before(async () => {
        connections = await (0, test_utils_1.createTestingConnections)({
            entities: [__dirname + "/entity/*{.js,.ts}"],
            schemaCreate: true,
            dropSchema: true,
        });
    });
    after(() => (0, test_utils_1.closeTestingConnections)(connections));
    it("should correctly add column and revert add", () => Promise.all(connections.map(async (connection) => {
        let numericType = "int";
        if (DriverUtils_1.DriverUtils.isSQLiteFamily(connection.driver)) {
            numericType = "integer";
        }
        else if (connection.driver.options.type === "spanner") {
            numericType = "int64";
        }
        let stringType = "varchar";
        if (connection.driver.options.type === "spanner") {
            stringType = "string";
        }
        const queryRunner = connection.createQueryRunner();
        let table = await queryRunner.getTable("post");
        let column1 = new TableColumn_1.TableColumn({
            name: "secondId",
            type: numericType,
            isUnique: true,
            isNullable: connection.driver.options.type === "spanner",
        });
        // CockroachDB and Spanner does not support altering primary key constraint
        if (!(connection.driver.options.type === "cockroachdb" ||
            connection.driver.options.type === "spanner"))
            column1.isPrimary = true;
        // MySql, CockroachDB and Sqlite does not supports autoincrement composite primary keys.
        // Spanner does not support autoincrement.
        if (!(DriverUtils_1.DriverUtils.isMySQLFamily(connection.driver) ||
            DriverUtils_1.DriverUtils.isSQLiteFamily(connection.driver) ||
            connection.driver.options.type === "cockroachdb" ||
            connection.driver.options.type === "spanner")) {
            column1.isGenerated = true;
            column1.generationStrategy = "increment";
        }
        let column2 = new TableColumn_1.TableColumn({
            name: "description",
            type: stringType,
            length: "100",
            default: "'this is description'",
            isNullable: connection.driver.options.type === "spanner",
        });
        let column3 = new TableColumn_1.TableColumn({
            name: "textAndTag",
            type: stringType,
            length: "200",
            generatedType: "STORED",
            asExpression: "text || tag",
            isNullable: connection.driver.options.type === "spanner",
        });
        let column4 = new TableColumn_1.TableColumn({
            name: "textAndTag2",
            type: "varchar",
            length: "200",
            generatedType: "VIRTUAL",
            asExpression: "text || tag",
            isNullable: connection.driver.options.type === "spanner",
        });
        await queryRunner.addColumn(table, column1);
        await queryRunner.addColumn("post", column2);
        table = await queryRunner.getTable("post");
        column1 = table.findColumnByName("secondId");
        column1.should.be.exist;
        column1.isUnique.should.be.true;
        if (connection.driver.options.type === "spanner") {
            column1.isNullable.should.be.true;
        }
        else {
            column1.isNullable.should.be.false;
        }
        // CockroachDB and Spanner does not support altering primary key constraint
        if (!(connection.driver.options.type === "cockroachdb" ||
            connection.driver.options.type === "spanner"))
            column1.isPrimary.should.be.true;
        // MySql, CockroachDB and Sqlite does not supports autoincrement composite primary keys.
        // Spanner does not support autoincrement.
        if (!(DriverUtils_1.DriverUtils.isMySQLFamily(connection.driver) ||
            DriverUtils_1.DriverUtils.isSQLiteFamily(connection.driver) ||
            connection.driver.options.type === "cockroachdb" ||
            connection.driver.options.type === "spanner")) {
            column1.isGenerated.should.be.true;
            column1.generationStrategy.should.be.equal("increment");
        }
        column2 = table.findColumnByName("description");
        column2.should.be.exist;
        column2.length.should.be.equal("100");
        // Spanner does not support DEFAULT
        if (!(connection.driver.options.type === "spanner")) {
            column2.default.should.be.equal("'this is description'");
        }
        if (DriverUtils_1.DriverUtils.isMySQLFamily(connection.driver) ||
            connection.driver.options.type === "postgres" ||
            connection.driver.options.type === "spanner") {
            const isMySQL = connection.options.type === "mysql";
            const isSpanner = connection.driver.options.type === "spanner";
            let postgresSupported = false;
            if (connection.driver.options.type === "postgres") {
                postgresSupported = connection.driver.isGeneratedColumnsSupported;
            }
            if (isMySQL || isSpanner || postgresSupported) {
                // create typeorm_metadata table manually
                await (0, test_utils_1.createTypeormMetadataTable)(connection.driver, queryRunner);
                await queryRunner.addColumn(table, column3);
                table = await queryRunner.getTable("post");
                column3 = table.findColumnByName("textAndTag");
                column3.should.be.exist;
                column3.generatedType.should.be.equals("STORED");
                column3.asExpression.should.be.a("string");
                if (DriverUtils_1.DriverUtils.isMySQLFamily(connection.driver)) {
                    await queryRunner.addColumn(table, column4);
                    table = await queryRunner.getTable("post");
                    column4 = table.findColumnByName("textAndTag2");
                    column4.should.be.exist;
                    column4.generatedType.should.be.equals("VIRTUAL");
                    column4.asExpression.should.be.a("string");
                }
            }
        }
        await queryRunner.executeMemoryDownSql();
        table = await queryRunner.getTable("post");
        (0, chai_1.expect)(table.findColumnByName("secondId")).to.be.undefined;
        (0, chai_1.expect)(table.findColumnByName("description")).to.be.undefined;
        await queryRunner.release();
    })));
});
//# sourceMappingURL=add-column.js.map