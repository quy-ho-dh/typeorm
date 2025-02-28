"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const test_utils_1 = require("../../utils/test-utils");
const Company_1 = require("./entity/Company");
const Office_1 = require("./entity/Office");
const chai_1 = require("chai");
describe("deferrable uq constraints should be check at the end of transaction", () => {
    let connections;
    before(async () => (connections = await (0, test_utils_1.createTestingConnections)({
        entities: [__dirname + "/entity/*{.js,.ts}"],
        enabledDrivers: ["postgres"],
    })));
    beforeEach(() => (0, test_utils_1.reloadTestingDatabases)(connections));
    after(() => (0, test_utils_1.closeTestingConnections)(connections));
    it("use initially deferred deferrable uq constraints", () => Promise.all(connections.map(async (connection) => {
        await connection.manager.transaction(async (entityManager) => {
            // first save company
            const company1 = new Company_1.Company();
            company1.id = 100;
            company1.name = "Acme";
            await entityManager.save(company1);
            // then save company with uq violation
            const company2 = new Company_1.Company();
            company2.id = 101;
            company2.name = "Acme";
            await entityManager.save(company2);
            // then update company 1 to fix uq violation
            company1.name = "Foobar";
            await entityManager.save(company1);
        });
        // now check
        const companies = await connection.manager.find(Company_1.Company, {
            order: { id: "ASC" },
        });
        (0, chai_1.expect)(companies).to.have.length(2);
        companies[0].should.be.eql({
            id: 100,
            name: "Foobar",
        });
        companies[1].should.be.eql({
            id: 101,
            name: "Acme",
        });
    })));
    it("use initially immediated deferrable uq constraints", () => Promise.all(connections.map(async (connection) => {
        await connection.manager.transaction(async (entityManager) => {
            // first set constraints deferred manually
            await entityManager.query("SET CONSTRAINTS ALL DEFERRED");
            // first save office
            const office1 = new Office_1.Office();
            office1.id = 200;
            office1.name = "Boston";
            await entityManager.save(office1);
            // then save office with uq violation
            const office2 = new Office_1.Office();
            office2.id = 201;
            office2.name = "Boston";
            await entityManager.save(office2);
            // then update office 1 to fix uq violation
            office1.name = "Cambridge";
            await entityManager.save(office1);
        });
        // now check
        const offices = await connection.manager.find(Office_1.Office, {
            order: { id: "ASC" },
        });
        (0, chai_1.expect)(offices).to.have.length(2);
        offices[0].should.be.eql({
            id: 200,
            name: "Cambridge",
        });
        offices[1].should.be.eql({
            id: 201,
            name: "Boston",
        });
    })));
});
//# sourceMappingURL=deferrable-unique.js.map