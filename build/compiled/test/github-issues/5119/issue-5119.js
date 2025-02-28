"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const test_utils_1 = require("../../utils/test-utils");
const src_1 = require("../../../src");
const assert_1 = require("assert");
describe("github issues > #5119 migration with foreign key that changes target", () => {
    let connections;
    before(async () => (connections = await (0, test_utils_1.createTestingConnections)({
        entities: [__dirname + "/entity/v1/*{.js,.ts}"],
        enabledDrivers: ["postgres"],
    })));
    beforeEach(() => (0, test_utils_1.reloadTestingDatabases)(connections));
    after(() => (0, test_utils_1.closeTestingConnections)([...connections]));
    it("should generate a drop and create step", async () => {
        return Promise.all(connections.map(async function (_connection) {
            const options = (0, test_utils_1.setupSingleTestingConnection)(_connection.options.type, {
                name: `${_connection.name}-v2`,
                entities: [__dirname + "/entity/v2/*{.js,.ts}"],
                dropSchema: false,
                schemaCreate: false,
            });
            if (!options) {
                (0, assert_1.fail)();
                return;
            }
            const dataSource = new src_1.DataSource(options);
            await dataSource.initialize();
            try {
                const sqlInMemory = await dataSource.driver
                    .createSchemaBuilder()
                    .log();
                const upQueries = sqlInMemory.upQueries.map((query) => query.query);
                const downQueries = sqlInMemory.downQueries.map((query) => query.query);
                upQueries.should.eql([
                    `ALTER TABLE "post" DROP CONSTRAINT "FK_4490d00e1925ca046a1f52ddf04"`,
                    `CREATE TABLE "account" ("id" SERIAL NOT NULL, "userId" integer, CONSTRAINT "PK_54115ee388cdb6d86bb4bf5b2ea" PRIMARY KEY ("id"))`,
                    `ALTER TABLE "account" ADD CONSTRAINT "FK_60328bf27019ff5498c4b977421" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
                    `ALTER TABLE "post" ADD CONSTRAINT "FK_4490d00e1925ca046a1f52ddf04" FOREIGN KEY ("ownerId") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
                ]);
                downQueries.should.eql([
                    `ALTER TABLE "post" ADD CONSTRAINT "FK_4490d00e1925ca046a1f52ddf04" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
                    `DROP TABLE "account"`,
                    `ALTER TABLE "account" DROP CONSTRAINT "FK_60328bf27019ff5498c4b977421"`,
                    `ALTER TABLE "post" DROP CONSTRAINT "FK_4490d00e1925ca046a1f52ddf04"`,
                ]);
            }
            finally {
                dataSource.close();
            }
        }));
    });
});
//# sourceMappingURL=issue-5119.js.map