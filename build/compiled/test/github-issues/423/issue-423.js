"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const test_utils_1 = require("../../utils/test-utils");
describe("github issues > #423 Cannot use Group as Table name && cannot autoSchemeSync when use alias Entity", () => {
    let connections;
    before(async () => (connections = await (0, test_utils_1.createTestingConnections)({
        entities: [__dirname + "/entity/*{.js,.ts}"],
        schemaCreate: false,
        dropSchema: true,
    })));
    after(() => (0, test_utils_1.closeTestingConnections)(connections));
    it("should successfully sync schema", () => Promise.all(connections.map(async (connection) => {
        await connection.synchronize();
        const queryRunner = connection.createQueryRunner();
        const table = await queryRunner.getTable("groups");
        await queryRunner.release();
        table.should.exist;
        // CockroachDB stores unique indices as UNIQUE constraints
        if (connection.driver.options.type === "cockroachdb") {
            table.uniques.length.should.be.equal(1);
            table.uniques[0].name.should.be.equal("Groups name");
            table.uniques[0].columnNames[0].should.be.equal("name");
        }
        else {
            table.indices.length.should.be.equal(1);
            table.indices[0].name.should.be.equal("Groups name");
            table.indices[0].columnNames[0].should.be.equal("name");
            table.indices[0].isUnique.should.be.true;
        }
    })));
});
//# sourceMappingURL=issue-423.js.map