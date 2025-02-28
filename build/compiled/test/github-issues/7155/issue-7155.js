"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const NestedSetMultipleRootError_1 = require("../../../src/error/NestedSetMultipleRootError");
const test_utils_1 = require("../../utils/test-utils");
const RelationEntities_1 = require("./entity/RelationEntities");
const RemainingTreeEntities_1 = require("./entity/RemainingTreeEntities");
const SqlServerTreeEntities_1 = require("./entity/SqlServerTreeEntities");
describe("github issues > #7155", () => {
    let connections;
    before(async () => (connections = await generateConnections()));
    beforeEach(() => (0, test_utils_1.reloadTestingDatabases)(connections));
    after(() => (0, test_utils_1.closeTestingConnections)(connections));
    /**
     * ------------------ SINGLE ID ------------------
     *
     * Closure table
     */
    it("(Closure/SingleID/Save) Update without parent", () => Promise.all(connections.map(async (connection) => {
        const Entity = getEntity(connection, "single_closure");
        const repo = connection.getTreeRepository(Entity);
        const entry1 = new Entity();
        await repo.save(entry1);
        const entry2 = new Entity();
        await repo.save(entry2);
        entry2.name = "entry2";
        await repo.save(entry2);
        const descendants = await repo.findDescendants(entry2);
        descendants.length.should.be.eql(1);
    })));
    it("(Closure/SingleID/Save) Update without tree change", () => Promise.all(connections.map(async (connection) => {
        const Entity = getEntity(connection, "single_closure");
        const repo = connection.getTreeRepository(Entity);
        const entry1 = new Entity();
        await repo.save(entry1);
        const entry11 = new Entity();
        entry11.parent = entry1;
        await repo.save(entry11);
        entry11.name = "entry11";
        await repo.save(entry11);
        const descendants = await repo.findDescendants(entry1);
        descendants.length.should.be.eql(2);
    })));
    it("(Closure/SingleID/Save) Set leaf entity as root", () => Promise.all(connections.map(async (connection) => {
        const Entity = getEntity(connection, "single_closure");
        const repo = connection.getTreeRepository(Entity);
        const entry1 = new Entity();
        await repo.save(entry1);
        const entry11 = new Entity();
        entry11.parent = entry1;
        await repo.save(entry11);
        entry11.parent = null;
        await repo.save(entry11);
        const descendants = await repo.findDescendants(entry1);
        descendants.length.should.be.eql(1);
    })));
    it("(Closure/SingleID/Save) Move leaf with multi root", () => Promise.all(connections.map(async (connection) => {
        const Entity = getEntity(connection, "single_closure");
        const repo = connection.getTreeRepository(Entity);
        const entry1 = new Entity();
        await repo.save(entry1);
        const entry2 = new Entity();
        await repo.save(entry2);
        const entry11 = new Entity();
        entry11.parent = entry1;
        await repo.save(entry11);
        // Assing entry11 from entry1 to entry2
        entry11.parent = entry2;
        await repo.save(entry11);
        const descendants = await repo.findDescendants(entry2);
        descendants.length.should.be.eql(2);
    })));
    it("(Closure/SingleID/Save) Move branch with single root", () => Promise.all(connections.map(async (connection) => {
        const Entity = getEntity(connection, "single_closure");
        const repo = connection.getTreeRepository(Entity);
        const entry1 = new Entity();
        await repo.save(entry1);
        const entry11 = new Entity();
        entry11.parent = entry1;
        await repo.save(entry11);
        const entry12 = new Entity();
        entry12.parent = entry1;
        await repo.save(entry12);
        const entry121 = new Entity();
        entry121.parent = entry12;
        await repo.save(entry121);
        const entry1211 = new Entity();
        entry1211.parent = entry121;
        await repo.save(entry1211);
        // Assing entry121 from entry12 to entry11
        entry121.parent = entry11;
        await repo.save(entry121);
        const descendants = await repo.findDescendants(entry11);
        descendants.length.should.be.eql(3);
    })));
    it("(Closure/SingleID/Save) Move branch with single root via children", () => Promise.all(connections.map(async (connection) => {
        const Entity = getEntity(connection, "single_closure");
        const repo = connection.getTreeRepository(Entity);
        const entry1 = new Entity();
        await repo.save(entry1);
        const entry11 = new Entity();
        entry11.parent = entry1;
        await repo.save(entry11);
        const entry12 = new Entity();
        entry12.parent = entry1;
        await repo.save(entry12);
        const entry121 = new Entity();
        entry121.parent = entry12;
        await repo.save(entry121);
        const entry1211 = new Entity();
        entry1211.parent = entry121;
        await repo.save(entry1211);
        // Assing entry121 from entry12 to entry11
        entry11.children = [entry121];
        await repo.save(entry11);
        const descendants = await repo.findDescendants(entry11);
        descendants.length.should.be.eql(3);
    })));
    it("(Closure/SingleID/Save) Move multiple branches with single root via children", () => Promise.all(connections.map(async (connection) => {
        const Entity = getEntity(connection, "single_closure");
        const repo = connection.getTreeRepository(Entity);
        const entry1 = new Entity();
        await repo.save(entry1);
        const entry11 = new Entity();
        entry11.parent = entry1;
        await repo.save(entry11);
        const entry111 = new Entity();
        entry111.parent = entry11;
        await repo.save(entry111);
        const entry12 = new Entity();
        entry12.parent = entry1;
        await repo.save(entry12);
        const entry121 = new Entity();
        entry121.parent = entry12;
        await repo.save(entry121);
        const entry1211 = new Entity();
        entry1211.parent = entry121;
        await repo.save(entry1211);
        // Assing entry121 from entry12 to entry11
        // And entry111 from entry11 to entry12
        entry11.children = [entry121];
        entry12.children = [entry111];
        await repo.save([entry11, entry12]);
        let descendants = await repo.findDescendants(entry11);
        descendants.length.should.be.eql(3);
        descendants = await repo.findDescendants(entry12);
        descendants.length.should.be.eql(2);
    })));
    it("(Closure/SingleID/Save) Remove and re-add parent", () => Promise.all(connections.map(async (connection) => {
        const Entity = getEntity(connection, "single_closure");
        const repo = connection.getTreeRepository(Entity);
        const entry1 = new Entity();
        await repo.save(entry1);
        const entry11 = new Entity();
        entry11.parent = entry1;
        await repo.save(entry11);
        const entry111 = new Entity();
        entry111.parent = entry11;
        await repo.save(entry111);
        let descendants = await repo.findDescendants(entry1);
        descendants.length.should.be.eql(3);
        entry11.parent = null;
        await repo.save(entry11);
        descendants = await repo.findDescendants(entry1);
        descendants.length.should.be.eql(1);
        entry11.parent = entry1;
        await repo.save(entry11);
        descendants = await repo.findDescendants(entry1);
        descendants.length.should.be.eql(3);
    })));
    it("(Closure/SingleID/Remove) Remove leaf with multi root", () => Promise.all(connections.map(async (connection) => {
        const Entity = getEntity(connection, "single_closure");
        const repo = connection.getTreeRepository(Entity);
        const entry1 = new Entity();
        await repo.save(entry1);
        const entry2 = new Entity();
        await repo.save(entry2);
        const entry11 = new Entity();
        entry11.parent = entry1;
        await repo.save(entry11);
        // Remove entry11 from entry1
        await repo.remove(entry11);
        const descendants = await repo.findDescendants(entry1);
        descendants.length.should.be.eql(1);
    })));
    it("(Closure/SingleID/Remove) Remove branch with single root", () => Promise.all(connections.map(async (connection) => {
        if (connection.driver.options.type === "mssql") {
            // This test will not working on sql server
            return;
        }
        const Entity = getEntity(connection, "single_closure");
        const repo = connection.getTreeRepository(Entity);
        const entry1 = new Entity();
        await repo.save(entry1);
        const entry11 = new Entity();
        entry11.parent = entry1;
        await repo.save(entry11);
        const entry12 = new Entity();
        entry12.parent = entry1;
        await repo.save(entry12);
        const entry111 = new Entity();
        entry111.parent = entry11;
        await repo.save(entry111);
        const entry1111 = new Entity();
        entry1111.parent = entry111;
        await repo.save(entry1111);
        // Remove entry111 from entry11
        await repo.remove(entry111);
        const descendants = await repo.findDescendants(entry11);
        descendants.length.should.be.eql(1);
    })));
    it("(Closure/SingleID/Remove) Remove multiple branches with single root", () => Promise.all(connections.map(async (connection) => {
        if (connection.driver.options.type === "mssql") {
            // This test will not working on sql server
            return;
        }
        const Entity = getEntity(connection, "single_closure");
        const repo = connection.getTreeRepository(Entity);
        const entry1 = new Entity();
        await repo.save(entry1);
        const entry11 = new Entity();
        entry11.parent = entry1;
        await repo.save(entry11);
        const entry111 = new Entity();
        entry111.parent = entry11;
        await repo.save(entry111);
        const entry12 = new Entity();
        entry12.parent = entry1;
        await repo.save(entry12);
        const entry121 = new Entity();
        entry121.parent = entry12;
        await repo.save(entry121);
        const entry1211 = new Entity();
        entry1211.parent = entry121;
        await repo.save(entry1211);
        // Remove entry11 and entry1211
        await repo.remove([entry11, entry1211]);
        let descendants = await repo.findDescendants(entry1);
        descendants.length.should.be.eql(3);
        descendants = await repo.findDescendants(entry12);
        descendants.length.should.be.eql(2);
    })));
    /**
     * Nested set
     */
    it("(Nested/SingleID/Save) Update without tree change", () => Promise.all(connections.map(async (connection) => {
        const expectedResults = [
            { id: 1, left: 1, right: 4 },
            { id: 2, left: 2, right: 3 },
        ];
        const Entity = getEntity(connection, "single_nested");
        const repo = connection.getTreeRepository(Entity);
        const ids = [];
        let nestedSet;
        const entry1 = new Entity();
        nestedSet = await repo.save(entry1);
        ids.push({ id: nestedSet.id });
        const entry11 = new Entity();
        entry11.parent = entry1;
        nestedSet = await repo.save(entry11);
        ids.push({ id: nestedSet.id });
        entry11.name = "entry11";
        await repo.save(entry11);
        const results = await getNestedSetIds(repo, ids);
        chai_1.assert.isTrue(isResultExpected(results, expectedResults));
        const descendants = await repo.findDescendants(entry1);
        descendants.length.should.be.eql(2);
    })));
    it("(Nested/SingleID/Save) Set multiple root entities", () => Promise.all(connections.map(async (connection) => {
        const Entity = getEntity(connection, "single_nested");
        const repo = connection.getTreeRepository(Entity);
        const entry1 = new Entity();
        await repo.save(entry1);
        try {
            const entry2 = new Entity();
            await repo.save(entry2);
        }
        catch (error) {
            chai_1.assert.instanceOf(error, NestedSetMultipleRootError_1.NestedSetMultipleRootError);
            return;
        }
        chai_1.assert.fail("Should have thrown an error.");
    })));
    it("(Nested/SingleID/Save) Set leaf entity as root", () => Promise.all(connections.map(async (connection) => {
        const Entity = getEntity(connection, "single_nested");
        const repo = connection.getTreeRepository(Entity);
        const entry1 = new Entity();
        await repo.save(entry1);
        const entry11 = new Entity();
        entry11.parent = entry1;
        await repo.save(entry11);
        try {
            entry11.parent = null;
            await repo.save(entry11);
        }
        catch (error) {
            chai_1.assert.instanceOf(error, NestedSetMultipleRootError_1.NestedSetMultipleRootError);
            return;
        }
        chai_1.assert.fail("Should have thrown an error.");
    })));
    it("(Nested/SingleID/Save) Move leaf with single root", () => Promise.all(connections.map(async (connection) => {
        const expectedResults = [
            { id: 1, left: 1, right: 6 },
            { id: 2, left: 3, right: 4 },
            { id: 3, left: 2, right: 5 },
        ];
        const Entity = getEntity(connection, "single_nested");
        const repo = connection.getTreeRepository(Entity);
        const ids = [];
        let nestedSet;
        const entry1 = new Entity();
        nestedSet = await repo.save(entry1);
        ids.push({ id: nestedSet.id });
        const entry11 = new Entity();
        entry11.parent = entry1;
        nestedSet = await repo.save(entry11);
        ids.push({ id: nestedSet.id });
        const entry12 = new Entity();
        entry12.parent = entry1;
        nestedSet = await repo.save(entry12);
        ids.push({ id: nestedSet.id });
        // Assing entry11 from entry1 to entry12
        entry11.parent = entry12;
        await repo.save(entry11);
        // Assertions
        const results = await getNestedSetIds(repo, ids);
        chai_1.assert.isTrue(isResultExpected(results, expectedResults));
        const descendants = await repo.findDescendants(entry12);
        descendants.length.should.be.eql(2);
    })));
    it("(Nested/SingleID/Save) Move branch with single root", () => Promise.all(connections.map(async (connection) => {
        const expectedResults = [
            { id: 1, left: 1, right: 10 },
            { id: 2, left: 2, right: 7 },
            { id: 3, left: 8, right: 9 },
            { id: 4, left: 3, right: 6 },
            { id: 5, left: 4, right: 5 },
        ];
        const Entity = getEntity(connection, "single_nested");
        const repo = connection.getTreeRepository(Entity);
        const ids = [];
        let nestedSet;
        const entry1 = new Entity();
        nestedSet = await repo.save(entry1);
        ids.push({ id: nestedSet.id });
        const entry11 = new Entity();
        entry11.parent = entry1;
        nestedSet = await repo.save(entry11);
        ids.push({ id: nestedSet.id });
        const entry12 = new Entity();
        entry12.parent = entry1;
        nestedSet = await repo.save(entry12);
        ids.push({ id: nestedSet.id });
        const entry121 = new Entity();
        entry121.parent = entry12;
        nestedSet = await repo.save(entry121);
        ids.push({ id: nestedSet.id });
        const entry1211 = new Entity();
        entry1211.parent = entry121;
        nestedSet = await repo.save(entry1211);
        ids.push({ id: nestedSet.id });
        // Assing entry121 from entry12 to entry11
        entry121.parent = entry11;
        await repo.save(entry121);
        // Assertions
        const results = await getNestedSetIds(repo, ids);
        chai_1.assert.isTrue(isResultExpected(results, expectedResults));
        const descendants = await repo.findDescendants(entry11);
        descendants.length.should.be.eql(3);
    })));
    it("(Nested/SingleID/Save) Move branch with single root via children", () => Promise.all(connections.map(async (connection) => {
        const expectedResults = [
            { id: 1, left: 1, right: 10 },
            { id: 2, left: 2, right: 7 },
            { id: 3, left: 8, right: 9 },
            { id: 4, left: 3, right: 6 },
            { id: 5, left: 4, right: 5 },
        ];
        const Entity = getEntity(connection, "single_nested");
        const repo = connection.getTreeRepository(Entity);
        const ids = [];
        let nestedSet;
        const entry1 = new Entity();
        nestedSet = await repo.save(entry1);
        ids.push({ id: nestedSet.id });
        const entry11 = new Entity();
        entry11.parent = entry1;
        nestedSet = await repo.save(entry11);
        ids.push({ id: nestedSet.id });
        const entry12 = new Entity();
        entry12.parent = entry1;
        nestedSet = await repo.save(entry12);
        ids.push({ id: nestedSet.id });
        const entry121 = new Entity();
        entry121.parent = entry12;
        nestedSet = await repo.save(entry121);
        ids.push({ id: nestedSet.id });
        const entry1211 = new Entity();
        entry1211.parent = entry121;
        nestedSet = await repo.save(entry1211);
        ids.push({ id: nestedSet.id });
        // Assing entry121 from entry12 to entry11
        entry11.children = [entry121];
        await repo.save(entry11);
        // Assertions
        const results = await getNestedSetIds(repo, ids);
        chai_1.assert.isTrue(isResultExpected(results, expectedResults));
        const descendants = await repo.findDescendants(entry11);
        descendants.length.should.be.eql(3);
    })));
    it("(Nested/SingleID/Save) Move multiple branches with single root via children", () => Promise.all(connections.map(async (connection) => {
        const expectedResults = [
            { id: 1, left: 1, right: 12 },
            { id: 2, left: 2, right: 7 },
            { id: 3, left: 9, right: 10 },
            { id: 4, left: 8, right: 11 },
            { id: 5, left: 3, right: 6 },
            { id: 6, left: 4, right: 5 },
        ];
        const Entity = getEntity(connection, "single_nested");
        const repo = connection.getTreeRepository(Entity);
        const ids = [];
        let nestedSet;
        const entry1 = new Entity();
        nestedSet = await repo.save(entry1);
        ids.push({ id: nestedSet.id });
        const entry11 = new Entity();
        entry11.parent = entry1;
        nestedSet = await repo.save(entry11);
        ids.push({ id: nestedSet.id });
        const entry111 = new Entity();
        entry111.parent = entry11;
        nestedSet = await repo.save(entry111);
        ids.push({ id: nestedSet.id });
        const entry12 = new Entity();
        entry12.parent = entry1;
        nestedSet = await repo.save(entry12);
        ids.push({ id: nestedSet.id });
        const entry121 = new Entity();
        entry121.parent = entry12;
        nestedSet = await repo.save(entry121);
        ids.push({ id: nestedSet.id });
        const entry1211 = new Entity();
        entry1211.parent = entry121;
        nestedSet = await repo.save(entry1211);
        ids.push({ id: nestedSet.id });
        // Assing entry121 from entry12 to entry11
        // And entry111 from entry11 to entry12
        entry11.children = [entry121];
        entry12.children = [entry111];
        await repo.save([entry11, entry12]);
        // Assertions
        const results = await getNestedSetIds(repo, ids);
        chai_1.assert.isTrue(isResultExpected(results, expectedResults));
        let descendants = await repo.findDescendants(entry11);
        descendants.length.should.be.eql(3);
        descendants = await repo.findDescendants(entry12);
        descendants.length.should.be.eql(2);
    })));
    it("(Nested/SingleID/Remove) Remove leaf with single root", () => Promise.all(connections.map(async (connection) => {
        const expectedResults = [{ id: 1, left: 1, right: 2 }];
        const Entity = getEntity(connection, "single_nested");
        const repo = connection.getTreeRepository(Entity);
        const ids = [];
        let nestedSet;
        const entry1 = new Entity();
        nestedSet = await repo.save(entry1);
        ids.push({ id: nestedSet.id });
        const entry11 = new Entity();
        entry11.parent = entry1;
        nestedSet = await repo.save(entry11);
        ids.push({ id: nestedSet.id });
        // Remove entry11 from entry1
        await repo.remove(entry11);
        // Assertions
        const results = await getNestedSetIds(repo, ids);
        chai_1.assert.isTrue(isResultExpected(results, expectedResults));
        const descendants = await repo.findDescendants(entry1);
        descendants.length.should.be.eql(1);
    })));
    it("(Nested/SingleID/Remove) Remove branch with single root", () => Promise.all(connections.map(async (connection) => {
        if (connection.driver.options.type === "mssql") {
            // This test will not working on sql server
            return;
        }
        const expectedResults = [
            { id: 1, left: 1, right: 6 },
            { id: 2, left: 2, right: 3 },
            { id: 3, left: 4, right: 5 },
        ];
        const Entity = getEntity(connection, "single_nested");
        const repo = connection.getTreeRepository(Entity);
        const ids = [];
        let nestedSet;
        const entry1 = new Entity();
        nestedSet = await repo.save(entry1);
        ids.push({ id: nestedSet.id });
        const entry11 = new Entity();
        entry11.parent = entry1;
        nestedSet = await repo.save(entry11);
        ids.push({ id: nestedSet.id });
        const entry12 = new Entity();
        entry12.parent = entry1;
        nestedSet = await repo.save(entry12);
        ids.push({ id: nestedSet.id });
        const entry111 = new Entity();
        entry111.parent = entry11;
        nestedSet = await repo.save(entry111);
        ids.push({ id: nestedSet.id });
        const entry1111 = new Entity();
        entry1111.parent = entry111;
        nestedSet = await repo.save(entry1111);
        ids.push({ id: nestedSet.id });
        // Remove entry111 from entry11
        await repo.remove(entry111);
        // Assertions
        const results = await getNestedSetIds(repo, ids);
        chai_1.assert.isTrue(isResultExpected(results, expectedResults));
        const descendants = await repo.findDescendants(entry11);
        descendants.length.should.be.eql(1);
    })));
    it("(Nested/SingleID/Remove) Remove multiple branches with single root", () => Promise.all(connections.map(async (connection) => {
        if (connection.driver.options.type === "mssql") {
            // This test will not working on sql server
            return;
        }
        const expectedResults = [
            { id: 1, left: 1, right: 6 },
            { id: 4, left: 2, right: 5 },
            { id: 5, left: 3, right: 4 },
        ];
        const Entity = getEntity(connection, "single_nested");
        const repo = connection.getTreeRepository(Entity);
        const ids = [];
        let nestedSet;
        const entry1 = new Entity();
        nestedSet = await repo.save(entry1);
        ids.push({ id: nestedSet.id });
        const entry11 = new Entity();
        entry11.parent = entry1;
        nestedSet = await repo.save(entry11);
        ids.push({ id: nestedSet.id });
        const entry111 = new Entity();
        entry111.parent = entry11;
        nestedSet = await repo.save(entry111);
        ids.push({ id: nestedSet.id });
        const entry12 = new Entity();
        entry12.parent = entry1;
        nestedSet = await repo.save(entry12);
        ids.push({ id: nestedSet.id });
        const entry121 = new Entity();
        entry121.parent = entry12;
        nestedSet = await repo.save(entry121);
        ids.push({ id: nestedSet.id });
        const entry1211 = new Entity();
        entry1211.parent = entry121;
        nestedSet = await repo.save(entry1211);
        ids.push({ id: nestedSet.id });
        // Remove entry11 and entry1211
        await repo.remove([entry11, entry1211]);
        // Assertions
        const results = await getNestedSetIds(repo, ids);
        chai_1.assert.isTrue(isResultExpected(results, expectedResults));
        let descendants = await repo.findDescendants(entry1);
        descendants.length.should.be.eql(3);
        descendants = await repo.findDescendants(entry12);
        descendants.length.should.be.eql(2);
    })));
    /**
     * Materialized path
     */
    it("(Materialized/SingleID/Save) Update without parent", () => Promise.all(connections.map(async (connection) => {
        const Entity = getEntity(connection, "single_materialized");
        const repo = connection.getTreeRepository(Entity);
        const entry1 = new Entity();
        await repo.save(entry1);
        const entry2 = new Entity();
        await repo.save(entry2);
        entry2.name = "entry2";
        await repo.save(entry2);
        const descendants = await repo.findDescendants(entry2);
        descendants.length.should.be.eql(1);
    })));
    it("(Materialized/SingleID/Save) Update without tree change", () => Promise.all(connections.map(async (connection) => {
        const Entity = getEntity(connection, "single_materialized");
        const repo = connection.getTreeRepository(Entity);
        const entry1 = new Entity();
        await repo.save(entry1);
        const entry11 = new Entity();
        entry11.parent = entry1;
        await repo.save(entry11);
        entry11.name = "entry11";
        await repo.save(entry11);
        const descendants = await repo.findDescendants(entry1);
        descendants.length.should.be.eql(2);
    })));
    it("(Materialized/SingleID/Save) Set leaf entity as root", () => Promise.all(connections.map(async (connection) => {
        const Entity = getEntity(connection, "single_materialized");
        const repo = connection.getTreeRepository(Entity);
        const entry1 = new Entity();
        await repo.save(entry1);
        const entry11 = new Entity();
        entry11.parent = entry1;
        await repo.save(entry11);
        entry11.parent = null;
        await repo.save(entry11);
        const descendants = await repo.findDescendants(entry1);
        descendants.length.should.be.eql(1);
    })));
    it("(Materialized/SingleID/Save) Move leaf with multi root", () => Promise.all(connections.map(async (connection) => {
        const Entity = getEntity(connection, "single_materialized");
        const repo = connection.getTreeRepository(Entity);
        const entry1 = new Entity();
        await repo.save(entry1);
        const entry2 = new Entity();
        await repo.save(entry2);
        const entry11 = new Entity();
        entry11.parent = entry1;
        await repo.save(entry11);
        // Assing entry11 from entry1 to entry2
        entry11.parent = entry2;
        await repo.save(entry11);
        const descendants = await repo.findDescendants(entry2);
        descendants.length.should.be.eql(2);
    })));
    it("(Materialized/SingleID/Save) Move branch with single root", () => Promise.all(connections.map(async (connection) => {
        const Entity = getEntity(connection, "single_materialized");
        const repo = connection.getTreeRepository(Entity);
        const entry1 = new Entity();
        await repo.save(entry1);
        const entry11 = new Entity();
        entry11.parent = entry1;
        await repo.save(entry11);
        const entry12 = new Entity();
        entry12.parent = entry1;
        await repo.save(entry12);
        const entry121 = new Entity();
        entry121.parent = entry12;
        await repo.save(entry121);
        const entry1211 = new Entity();
        entry1211.parent = entry121;
        await repo.save(entry1211);
        // Assing entry121 from entry12 to entry11
        entry121.parent = entry11;
        await repo.save(entry121);
        const descendants = await repo.findDescendants(entry11);
        descendants.length.should.be.eql(3);
    })));
    it("(Materialized/SingleID/Save) Move branch with single root via children", () => Promise.all(connections.map(async (connection) => {
        const Entity = getEntity(connection, "single_materialized");
        const repo = connection.getTreeRepository(Entity);
        const entry1 = new Entity();
        await repo.save(entry1);
        const entry11 = new Entity();
        entry11.parent = entry1;
        await repo.save(entry11);
        const entry12 = new Entity();
        entry12.parent = entry1;
        await repo.save(entry12);
        const entry121 = new Entity();
        entry121.parent = entry12;
        await repo.save(entry121);
        const entry1211 = new Entity();
        entry1211.parent = entry121;
        await repo.save(entry1211);
        // Assing entry121 from entry12 to entry11
        entry11.children = [entry121];
        await repo.save(entry11);
        const descendants = await repo.findDescendants(entry11);
        descendants.length.should.be.eql(3);
    })));
    it("(Materialized/SingleID/Save) Move multiple branches with single root via children", () => Promise.all(connections.map(async (connection) => {
        const Entity = getEntity(connection, "single_materialized");
        const repo = connection.getTreeRepository(Entity);
        const entry1 = new Entity();
        await repo.save(entry1);
        const entry11 = new Entity();
        entry11.parent = entry1;
        await repo.save(entry11);
        const entry111 = new Entity();
        entry111.parent = entry11;
        await repo.save(entry111);
        const entry12 = new Entity();
        entry12.parent = entry1;
        await repo.save(entry12);
        const entry121 = new Entity();
        entry121.parent = entry12;
        await repo.save(entry121);
        const entry1211 = new Entity();
        entry1211.parent = entry121;
        await repo.save(entry1211);
        // Assing entry121 from entry12 to entry11
        // And entry111 from entry11 to entry12
        entry11.children = [entry121];
        entry12.children = [entry111];
        await repo.save([entry11, entry12]);
        let descendants = await repo.findDescendants(entry11);
        descendants.length.should.be.eql(3);
        descendants = await repo.findDescendants(entry12);
        descendants.length.should.be.eql(2);
    })));
    it("(Materialized/SingleID/Remove) Remove leaf with multi root", () => Promise.all(connections.map(async (connection) => {
        const Entity = getEntity(connection, "single_materialized");
        const repo = connection.getTreeRepository(Entity);
        const entry1 = new Entity();
        await repo.save(entry1);
        const entry2 = new Entity();
        await repo.save(entry2);
        const entry11 = new Entity();
        entry11.parent = entry1;
        await repo.save(entry11);
        // Remove entry11 from entry1
        await repo.remove(entry11);
        const descendants = await repo.findDescendants(entry1);
        descendants.length.should.be.eql(1);
    })));
    it("(Materialized/SingleID/Remove) Remove branch with single root", () => Promise.all(connections.map(async (connection) => {
        if (connection.driver.options.type === "mssql") {
            // This test will not working on sql server
            return;
        }
        const Entity = getEntity(connection, "single_materialized");
        const repo = connection.getTreeRepository(Entity);
        const entry1 = new Entity();
        await repo.save(entry1);
        const entry11 = new Entity();
        entry11.parent = entry1;
        await repo.save(entry11);
        const entry12 = new Entity();
        entry12.parent = entry1;
        await repo.save(entry12);
        const entry111 = new Entity();
        entry111.parent = entry11;
        await repo.save(entry111);
        const entry1111 = new Entity();
        entry1111.parent = entry111;
        await repo.save(entry1111);
        // Remove entry111 from entry11
        await repo.remove(entry111);
        const descendants = await repo.findDescendants(entry11);
        descendants.length.should.be.eql(1);
    })));
    it("(Materialized/SingleID/Remove) Remove multiple branches with single root", () => Promise.all(connections.map(async (connection) => {
        if (connection.driver.options.type === "mssql") {
            // This test will not working on sql server
            return;
        }
        const Entity = getEntity(connection, "single_materialized");
        const repo = connection.getTreeRepository(Entity);
        const entry1 = new Entity();
        await repo.save(entry1);
        const entry11 = new Entity();
        entry11.parent = entry1;
        await repo.save(entry11);
        const entry111 = new Entity();
        entry111.parent = entry11;
        await repo.save(entry111);
        const entry12 = new Entity();
        entry12.parent = entry1;
        await repo.save(entry12);
        const entry121 = new Entity();
        entry121.parent = entry12;
        await repo.save(entry121);
        const entry1211 = new Entity();
        entry1211.parent = entry121;
        await repo.save(entry1211);
        // Remove entry11 and entry1211
        await repo.remove([entry11, entry1211]);
        let descendants = await repo.findDescendants(entry1);
        descendants.length.should.be.eql(3);
        descendants = await repo.findDescendants(entry12);
        descendants.length.should.be.eql(2);
    })));
    /**
     * ------------------ MULTI ID ------------------
     *
     * Nested set
     */
    it("(Nested/MultiID/Save) Update without tree change", () => Promise.all(connections.map(async (connection) => {
        const expectedResults = [
            { column: "A", row: 1, left: 1, right: 4 },
            { column: "A", row: 2, left: 2, right: 3 },
        ];
        const Entity = getEntity(connection, "multi_nested");
        const repo = connection.getTreeRepository(Entity);
        const ids = [];
        let nestedSet;
        const entry1 = new Entity();
        entry1.column = "A";
        entry1.row = 1;
        nestedSet = await repo.save(entry1);
        ids.push({ column: nestedSet.column, row: nestedSet.row });
        const entry11 = new Entity();
        entry11.column = "A";
        entry11.row = 2;
        entry11.parent = entry1;
        nestedSet = await repo.save(entry11);
        ids.push({ column: nestedSet.column, row: nestedSet.row });
        entry11.name = "entry11";
        await repo.save(entry11);
        // Assertions
        const results = await getNestedSetIds(repo, ids);
        chai_1.assert.isTrue(isResultExpected(results, expectedResults));
        const descendants = await repo.findDescendants(entry1);
        descendants.length.should.be.eql(2);
    })));
    it("(Nested/MultiID/Save) Set multiple root entities", () => Promise.all(connections.map(async (connection) => {
        const Entity = getEntity(connection, "multi_nested");
        const repo = connection.getTreeRepository(Entity);
        const entry1 = new Entity();
        entry1.column = "A";
        entry1.row = 1;
        await repo.save(entry1);
        try {
            const entry2 = new Entity();
            entry2.column = "B";
            entry2.row = 1;
            await repo.save(entry2);
        }
        catch (error) {
            chai_1.assert.instanceOf(error, NestedSetMultipleRootError_1.NestedSetMultipleRootError);
            return;
        }
        chai_1.assert.fail("Should have thrown an error.");
    })));
    it("(Nested/MultiID/Save) Set leaf entity as root", () => Promise.all(connections.map(async (connection) => {
        const Entity = getEntity(connection, "multi_nested");
        const repo = connection.getTreeRepository(Entity);
        const entry1 = new Entity();
        entry1.column = "A";
        entry1.row = 1;
        await repo.save(entry1);
        const entry11 = new Entity();
        entry11.column = "A";
        entry11.row = 2;
        entry11.parent = entry1;
        await repo.save(entry11);
        try {
            entry11.parent = null;
            await repo.save(entry11);
        }
        catch (error) {
            chai_1.assert.instanceOf(error, NestedSetMultipleRootError_1.NestedSetMultipleRootError);
            return;
        }
        chai_1.assert.fail("Should have thrown an error.");
    })));
    it("(Nested/MultiID/Save) Move leaf with single root", () => Promise.all(connections.map(async (connection) => {
        const expectedResults = [
            { column: "A", row: 1, left: 1, right: 6 },
            { column: "A", row: 2, left: 3, right: 4 },
            { column: "A", row: 3, left: 2, right: 5 },
        ];
        const Entity = getEntity(connection, "multi_nested");
        const repo = connection.getTreeRepository(Entity);
        const ids = [];
        let nestedSet;
        const entry1 = new Entity();
        entry1.column = "A";
        entry1.row = 1;
        nestedSet = await repo.save(entry1);
        ids.push({ column: nestedSet.column, row: nestedSet.row });
        const entry11 = new Entity();
        entry11.column = "A";
        entry11.row = 2;
        entry11.parent = entry1;
        nestedSet = await repo.save(entry11);
        ids.push({ column: nestedSet.column, row: nestedSet.row });
        const entry12 = new Entity();
        entry12.column = "A";
        entry12.row = 3;
        entry12.parent = entry1;
        nestedSet = await repo.save(entry12);
        ids.push({ column: nestedSet.column, row: nestedSet.row });
        // Assing entry11 from entry1 to entry12
        entry11.parent = entry12;
        await repo.save(entry11);
        // Assertions
        const results = await getNestedSetIds(repo, ids);
        chai_1.assert.isTrue(isResultExpected(results, expectedResults));
        const descendants = await repo.findDescendants(entry12);
        descendants.length.should.be.eql(2);
    })));
    it("(Nested/MultiID/Save) Move branch with single root", () => Promise.all(connections.map(async (connection) => {
        const expectedResults = [
            { column: "A", row: 1, left: 1, right: 10 },
            { column: "A", row: 2, left: 2, right: 7 },
            { column: "A", row: 3, left: 8, right: 9 },
            { column: "B", row: 3, left: 3, right: 6 },
            { column: "C", row: 3, left: 4, right: 5 },
        ];
        const Entity = getEntity(connection, "multi_nested");
        const repo = connection.getTreeRepository(Entity);
        const ids = [];
        let nestedSet;
        const entry1 = new Entity();
        entry1.column = "A";
        entry1.row = 1;
        nestedSet = await repo.save(entry1);
        ids.push({ column: nestedSet.column, row: nestedSet.row });
        const entry11 = new Entity();
        entry11.column = "A";
        entry11.row = 2;
        entry11.parent = entry1;
        nestedSet = await repo.save(entry11);
        ids.push({ column: nestedSet.column, row: nestedSet.row });
        const entry12 = new Entity();
        entry12.column = "A";
        entry12.row = 3;
        entry12.parent = entry1;
        nestedSet = await repo.save(entry12);
        ids.push({ column: nestedSet.column, row: nestedSet.row });
        const entry121 = new Entity();
        entry121.column = "B";
        entry121.row = 3;
        entry121.parent = entry12;
        nestedSet = await repo.save(entry121);
        ids.push({ column: nestedSet.column, row: nestedSet.row });
        const entry1211 = new Entity();
        entry1211.column = "C";
        entry1211.row = 3;
        entry1211.parent = entry121;
        nestedSet = await repo.save(entry1211);
        ids.push({ column: nestedSet.column, row: nestedSet.row });
        // Assing entry121 from entry12 to entry11
        entry121.parent = entry11;
        await repo.save(entry121);
        // Assertions
        const results = await getNestedSetIds(repo, ids);
        chai_1.assert.isTrue(isResultExpected(results, expectedResults));
        const descendants = await repo.findDescendants(entry11);
        descendants.length.should.be.eql(3);
    })));
    it("(Nested/MultiID/Save) Move branch with single root via children", () => Promise.all(connections.map(async (connection) => {
        const expectedResults = [
            { column: "A", row: 1, left: 1, right: 10 },
            { column: "A", row: 2, left: 2, right: 7 },
            { column: "A", row: 3, left: 8, right: 9 },
            { column: "B", row: 3, left: 3, right: 6 },
            { column: "C", row: 3, left: 4, right: 5 },
        ];
        const Entity = getEntity(connection, "multi_nested");
        const repo = connection.getTreeRepository(Entity);
        const ids = [];
        let nestedSet;
        const entry1 = new Entity();
        entry1.column = "A";
        entry1.row = 1;
        nestedSet = await repo.save(entry1);
        ids.push({ column: nestedSet.column, row: nestedSet.row });
        const entry11 = new Entity();
        entry11.column = "A";
        entry11.row = 2;
        entry11.parent = entry1;
        nestedSet = await repo.save(entry11);
        ids.push({ column: nestedSet.column, row: nestedSet.row });
        const entry12 = new Entity();
        entry12.column = "A";
        entry12.row = 3;
        entry12.parent = entry1;
        nestedSet = await repo.save(entry12);
        ids.push({ column: nestedSet.column, row: nestedSet.row });
        const entry121 = new Entity();
        entry121.column = "B";
        entry121.row = 3;
        entry121.parent = entry12;
        nestedSet = await repo.save(entry121);
        ids.push({ column: nestedSet.column, row: nestedSet.row });
        const entry1211 = new Entity();
        entry1211.column = "C";
        entry1211.row = 3;
        entry1211.parent = entry121;
        nestedSet = await repo.save(entry1211);
        ids.push({ column: nestedSet.column, row: nestedSet.row });
        // Assing entry121 from entry12 to entry11
        entry11.children = [entry121];
        await repo.save(entry11);
        // Assertions
        const results = await getNestedSetIds(repo, ids);
        chai_1.assert.isTrue(isResultExpected(results, expectedResults));
        const descendants = await repo.findDescendants(entry11);
        descendants.length.should.be.eql(3);
    })));
    it("(Nested/MultiID/Save) Move multiple branches with single root via children", () => Promise.all(connections.map(async (connection) => {
        const expectedResults = [
            { column: "A", row: 1, left: 1, right: 12 },
            { column: "A", row: 2, left: 2, right: 7 },
            { column: "A", row: 3, left: 8, right: 11 },
            { column: "B", row: 2, left: 9, right: 10 },
            { column: "B", row: 3, left: 3, right: 6 },
            { column: "C", row: 3, left: 4, right: 5 },
        ];
        const Entity = getEntity(connection, "multi_nested");
        const repo = connection.getTreeRepository(Entity);
        const ids = [];
        let nestedSet;
        const entry1 = new Entity();
        entry1.column = "A";
        entry1.row = 1;
        nestedSet = await repo.save(entry1);
        ids.push({ column: nestedSet.column, row: nestedSet.row });
        const entry11 = new Entity();
        entry11.parent = entry1;
        entry11.column = "A";
        entry11.row = 2;
        nestedSet = await repo.save(entry11);
        ids.push({ column: nestedSet.column, row: nestedSet.row });
        const entry111 = new Entity();
        entry111.column = "B";
        entry111.row = 2;
        entry111.parent = entry11;
        nestedSet = await repo.save(entry111);
        ids.push({ column: nestedSet.column, row: nestedSet.row });
        const entry12 = new Entity();
        entry12.column = "A";
        entry12.row = 3;
        entry12.parent = entry1;
        nestedSet = await repo.save(entry12);
        ids.push({ column: nestedSet.column, row: nestedSet.row });
        const entry121 = new Entity();
        entry121.column = "B";
        entry121.row = 3;
        entry121.parent = entry12;
        nestedSet = await repo.save(entry121);
        ids.push({ column: nestedSet.column, row: nestedSet.row });
        const entry1211 = new Entity();
        entry1211.column = "C";
        entry1211.row = 3;
        entry1211.parent = entry121;
        nestedSet = await repo.save(entry1211);
        ids.push({ column: nestedSet.column, row: nestedSet.row });
        // Assing entry121 from entry12 to entry11
        // And entry111 from entry11 to entry12
        entry11.children = [entry121];
        entry12.children = [entry111];
        await repo.save([entry11, entry12]);
        // Assertions
        const results = await getNestedSetIds(repo, ids);
        chai_1.assert.isTrue(isResultExpected(results, expectedResults));
        let descendants = await repo.findDescendants(entry11);
        descendants.length.should.be.eql(3);
        descendants = await repo.findDescendants(entry12);
        descendants.length.should.be.eql(2);
    })));
    it("(Nested/MultiID/Remove) Remove leaf with single root", () => Promise.all(connections.map(async (connection) => {
        const expectedResults = [
            { column: "A", row: 1, left: 1, right: 2 },
        ];
        const Entity = getEntity(connection, "multi_nested");
        const repo = connection.getTreeRepository(Entity);
        const ids = [];
        let nestedSet;
        const entry1 = new Entity();
        entry1.column = "A";
        entry1.row = 1;
        nestedSet = await repo.save(entry1);
        ids.push({ column: nestedSet.column, row: nestedSet.row });
        const entry11 = new Entity();
        entry11.column = "A";
        entry11.row = 2;
        entry11.parent = entry1;
        nestedSet = await repo.save(entry11);
        ids.push({ column: nestedSet.column, row: nestedSet.row });
        // Remove entry11 from entry1
        await repo.remove(entry11);
        // Assertions
        const results = await getNestedSetIds(repo, ids);
        chai_1.assert.isTrue(isResultExpected(results, expectedResults));
        const descendants = await repo.findDescendants(entry1);
        descendants.length.should.be.eql(1);
    })));
    it("(Nested/MultiID/Remove) Remove branch with single root", () => Promise.all(connections.map(async (connection) => {
        if (connection.driver.options.type === "mssql") {
            // This test will not working on sql server
            return;
        }
        const expectedResults = [
            { column: "A", row: 1, left: 1, right: 6 },
            { column: "A", row: 2, left: 2, right: 3 },
            { column: "A", row: 3, left: 4, right: 5 },
        ];
        const Entity = getEntity(connection, "multi_nested");
        const repo = connection.getTreeRepository(Entity);
        const ids = [];
        let nestedSet;
        const entry1 = new Entity();
        entry1.column = "A";
        entry1.row = 1;
        nestedSet = await repo.save(entry1);
        ids.push({ column: nestedSet.column, row: nestedSet.row });
        const entry11 = new Entity();
        entry11.column = "A";
        entry11.row = 2;
        entry11.parent = entry1;
        nestedSet = await repo.save(entry11);
        ids.push({ column: nestedSet.column, row: nestedSet.row });
        const entry12 = new Entity();
        entry12.column = "A";
        entry12.row = 3;
        entry12.parent = entry1;
        nestedSet = await repo.save(entry12);
        ids.push({ column: nestedSet.column, row: nestedSet.row });
        const entry111 = new Entity();
        entry111.column = "B";
        entry111.row = 2;
        entry111.parent = entry11;
        nestedSet = await repo.save(entry111);
        ids.push({ column: nestedSet.column, row: nestedSet.row });
        const entry1111 = new Entity();
        entry1111.column = "C";
        entry1111.row = 2;
        entry1111.parent = entry111;
        nestedSet = await repo.save(entry1111);
        ids.push({ column: nestedSet.column, row: nestedSet.row });
        // Remove entry111 from entry11
        await repo.remove(entry111);
        // Assertions
        const results = await getNestedSetIds(repo, ids);
        chai_1.assert.isTrue(isResultExpected(results, expectedResults));
        const descendants = await repo.findDescendants(entry11);
        descendants.length.should.be.eql(1);
    })));
    it("(Nested/MultiID/Remove) Remove multiple branches with single root", () => Promise.all(connections.map(async (connection) => {
        if (connection.driver.options.type === "mssql") {
            // This test will not working on sql server
            return;
        }
        const expectedResults = [
            { column: "A", row: 1, left: 1, right: 6 },
            { column: "A", row: 3, left: 2, right: 5 },
            { column: "B", row: 3, left: 3, right: 4 },
        ];
        const Entity = getEntity(connection, "multi_nested");
        const repo = connection.getTreeRepository(Entity);
        const ids = [];
        let nestedSet;
        const entry1 = new Entity();
        entry1.column = "A";
        entry1.row = 1;
        nestedSet = await repo.save(entry1);
        ids.push({ column: nestedSet.column, row: nestedSet.row });
        const entry11 = new Entity();
        entry11.column = "A";
        entry11.row = 2;
        entry11.parent = entry1;
        nestedSet = await repo.save(entry11);
        ids.push({ column: nestedSet.column, row: nestedSet.row });
        const entry111 = new Entity();
        entry111.column = "B";
        entry111.row = 2;
        entry111.parent = entry11;
        nestedSet = await repo.save(entry111);
        ids.push({ column: nestedSet.column, row: nestedSet.row });
        const entry12 = new Entity();
        entry12.column = "A";
        entry12.row = 3;
        entry12.parent = entry1;
        nestedSet = await repo.save(entry12);
        ids.push({ column: nestedSet.column, row: nestedSet.row });
        const entry121 = new Entity();
        entry121.column = "B";
        entry121.row = 3;
        entry121.parent = entry12;
        nestedSet = await repo.save(entry121);
        ids.push({ column: nestedSet.column, row: nestedSet.row });
        const entry1211 = new Entity();
        entry1211.column = "C";
        entry1211.row = 3;
        entry1211.parent = entry121;
        nestedSet = await repo.save(entry1211);
        ids.push({ column: nestedSet.column, row: nestedSet.row });
        // Remove entry11 and entry1211
        await repo.remove([entry11, entry1211]);
        // Assertions
        const results = await getNestedSetIds(repo, ids);
        chai_1.assert.isTrue(isResultExpected(results, expectedResults));
        let descendants = await repo.findDescendants(entry1);
        descendants.length.should.be.eql(3);
        descendants = await repo.findDescendants(entry12);
        descendants.length.should.be.eql(2);
    })));
    /**
     * Materialized path
     */
    it("(Materialized/MultiID/Save) Update without parent", () => Promise.all(connections.map(async (connection) => {
        const Entity = getEntity(connection, "multi_materialized");
        const repo = connection.getTreeRepository(Entity);
        const entry1 = new Entity();
        entry1.column = "A";
        entry1.row = 1;
        await repo.save(entry1);
        const entry2 = new Entity();
        entry2.column = "B";
        entry2.row = 1;
        await repo.save(entry2);
        entry2.name = "entry2";
        await repo.save(entry2);
        const descendants = await repo.findDescendants(entry2);
        descendants.length.should.be.eql(1);
    })));
    it("(Materialized/MultiID/Save) Update without tree change", () => Promise.all(connections.map(async (connection) => {
        const Entity = getEntity(connection, "multi_materialized");
        const repo = connection.getTreeRepository(Entity);
        const entry1 = new Entity();
        entry1.column = "A";
        entry1.row = 1;
        await repo.save(entry1);
        const entry11 = new Entity();
        entry11.column = "A";
        entry11.row = 2;
        entry11.parent = entry1;
        await repo.save(entry11);
        entry11.name = "entry11";
        await repo.save(entry11);
        const descendants = await repo.findDescendants(entry1);
        descendants.length.should.be.eql(2);
    })));
    it("(Materialized/MultiID/Save) Set leaf entity as root", () => Promise.all(connections.map(async (connection) => {
        const Entity = getEntity(connection, "multi_materialized");
        const repo = connection.getTreeRepository(Entity);
        const entry1 = new Entity();
        entry1.column = "A";
        entry1.row = 1;
        await repo.save(entry1);
        const entry11 = new Entity();
        entry11.column = "A";
        entry11.row = 2;
        entry11.parent = entry1;
        await repo.save(entry11);
        entry11.parent = null;
        await repo.save(entry11);
        const descendants = await repo.findDescendants(entry1);
        descendants.length.should.be.eql(1);
    })));
    it("(Materialized/MultiID/Save) Move leaf with multi root", () => Promise.all(connections.map(async (connection) => {
        const Entity = getEntity(connection, "multi_materialized");
        const repo = connection.getTreeRepository(Entity);
        const entry1 = new Entity();
        entry1.column = "A";
        entry1.row = 1;
        await repo.save(entry1);
        const entry2 = new Entity();
        entry2.column = "A";
        entry2.row = 2;
        await repo.save(entry2);
        const entry11 = new Entity();
        entry11.column = "B";
        entry11.row = 1;
        entry11.parent = entry1;
        await repo.save(entry11);
        // Assing entry11 from entry1 to entry2
        entry11.parent = entry2;
        await repo.save(entry11);
        const descendants = await repo.findDescendants(entry2);
        descendants.length.should.be.eql(2);
    })));
    it("(Materialized/MultiID/Save) Move branch with single root", () => Promise.all(connections.map(async (connection) => {
        const Entity = getEntity(connection, "multi_materialized");
        const repo = connection.getTreeRepository(Entity);
        const entry1 = new Entity();
        entry1.column = "A";
        entry1.row = 1;
        await repo.save(entry1);
        const entry11 = new Entity();
        entry11.column = "B";
        entry11.row = 1;
        entry11.parent = entry1;
        await repo.save(entry11);
        const entry12 = new Entity();
        entry12.column = "B";
        entry12.row = 2;
        entry12.parent = entry1;
        await repo.save(entry12);
        const entry121 = new Entity();
        entry121.column = "C";
        entry121.row = 2;
        entry121.parent = entry12;
        await repo.save(entry121);
        const entry1211 = new Entity();
        entry1211.column = "D";
        entry1211.row = 2;
        entry1211.parent = entry121;
        await repo.save(entry1211);
        // Assing entry121 from entry12 to entry11
        entry121.parent = entry11;
        await repo.save(entry121);
        const descendants = await repo.findDescendants(entry11);
        descendants.length.should.be.eql(3);
    })));
    it("(Materialized/MultiID/Save) Move branch with single root via children", () => Promise.all(connections.map(async (connection) => {
        const Entity = getEntity(connection, "multi_materialized");
        const repo = connection.getTreeRepository(Entity);
        const entry1 = new Entity();
        entry1.column = "A";
        entry1.row = 1;
        await repo.save(entry1);
        const entry11 = new Entity();
        entry11.column = "B";
        entry11.row = 1;
        entry11.parent = entry1;
        await repo.save(entry11);
        const entry12 = new Entity();
        entry12.column = "B";
        entry12.row = 2;
        entry12.parent = entry1;
        await repo.save(entry12);
        const entry121 = new Entity();
        entry121.column = "C";
        entry121.row = 2;
        entry121.parent = entry12;
        await repo.save(entry121);
        const entry1211 = new Entity();
        entry1211.column = "D";
        entry1211.row = 2;
        entry1211.parent = entry121;
        await repo.save(entry1211);
        // Assing entry121 from entry12 to entry11
        entry11.children = [entry121];
        await repo.save(entry11);
        const descendants = await repo.findDescendants(entry11);
        descendants.length.should.be.eql(3);
    })));
    it("(Materialized/MultiID/Save) Move multiple branches with single root via children", () => Promise.all(connections.map(async (connection) => {
        const Entity = getEntity(connection, "multi_materialized");
        const repo = connection.getTreeRepository(Entity);
        const entry1 = new Entity();
        entry1.column = "A";
        entry1.row = 1;
        await repo.save(entry1);
        const entry11 = new Entity();
        entry11.column = "B";
        entry11.row = 1;
        entry11.parent = entry1;
        await repo.save(entry11);
        const entry111 = new Entity();
        entry111.column = "C";
        entry111.row = 1;
        entry111.parent = entry11;
        await repo.save(entry111);
        const entry12 = new Entity();
        entry12.column = "B";
        entry12.row = 2;
        entry12.parent = entry1;
        await repo.save(entry12);
        const entry121 = new Entity();
        entry121.column = "C";
        entry121.row = 2;
        entry121.parent = entry12;
        await repo.save(entry121);
        const entry1211 = new Entity();
        entry1211.column = "D";
        entry1211.row = 2;
        entry1211.parent = entry121;
        await repo.save(entry1211);
        // Assing entry121 from entry12 to entry11
        // And entry111 from entry11 to entry12
        entry11.children = [entry121];
        entry12.children = [entry111];
        await repo.save([entry11, entry12]);
        let descendants = await repo.findDescendants(entry11);
        descendants.length.should.be.eql(3);
        descendants = await repo.findDescendants(entry12);
        descendants.length.should.be.eql(2);
    })));
    it("(Materialized/MultiID/Remove) Remove leaf with multi root", () => Promise.all(connections.map(async (connection) => {
        const Entity = getEntity(connection, "multi_materialized");
        const repo = connection.getTreeRepository(Entity);
        const entry1 = new Entity();
        entry1.column = "A";
        entry1.row = 1;
        await repo.save(entry1);
        const entry2 = new Entity();
        entry2.column = "B";
        entry2.row = 1;
        await repo.save(entry2);
        const entry11 = new Entity();
        entry11.column = "A";
        entry11.row = 2;
        entry11.parent = entry1;
        await repo.save(entry11);
        // Remove entry11 from entry1
        await repo.remove(entry11);
        const descendants = await repo.findDescendants(entry1);
        descendants.length.should.be.eql(1);
    })));
    it("(Materialized/MultiID/Remove) Remove branch with single root", () => Promise.all(connections.map(async (connection) => {
        if (connection.driver.options.type === "mssql") {
            // This test will not working on sql server
            return;
        }
        const Entity = getEntity(connection, "multi_materialized");
        const repo = connection.getTreeRepository(Entity);
        const entry1 = new Entity();
        entry1.column = "A";
        entry1.row = 1;
        await repo.save(entry1);
        const entry11 = new Entity();
        entry11.column = "A";
        entry11.row = 2;
        entry11.parent = entry1;
        await repo.save(entry11);
        const entry12 = new Entity();
        entry12.column = "B";
        entry12.row = 2;
        entry12.parent = entry1;
        await repo.save(entry12);
        const entry111 = new Entity();
        entry111.column = "C";
        entry111.row = 1;
        entry111.parent = entry11;
        await repo.save(entry111);
        const entry1111 = new Entity();
        entry1111.column = "D";
        entry1111.row = 1;
        entry1111.parent = entry111;
        await repo.save(entry1111);
        // Remove entry111 from entry11
        await repo.remove(entry111);
        const descendants = await repo.findDescendants(entry11);
        descendants.length.should.be.eql(1);
    })));
    it("(Materialized/MultiID/Remove) Remove multiple branches with single root", () => Promise.all(connections.map(async (connection) => {
        if (connection.driver.options.type === "mssql") {
            // This test will not working on sql server
            return;
        }
        const Entity = getEntity(connection, "multi_materialized");
        const repo = connection.getTreeRepository(Entity);
        const entry1 = new Entity();
        entry1.column = "A";
        entry1.row = 1;
        await repo.save(entry1);
        const entry11 = new Entity();
        entry11.column = "B";
        entry11.row = 1;
        entry11.parent = entry1;
        await repo.save(entry11);
        const entry111 = new Entity();
        entry111.column = "C";
        entry111.row = 1;
        entry111.parent = entry11;
        await repo.save(entry111);
        const entry12 = new Entity();
        entry12.column = "B";
        entry12.row = 2;
        entry12.parent = entry1;
        await repo.save(entry12);
        const entry121 = new Entity();
        entry121.column = "C";
        entry121.row = 2;
        entry121.parent = entry12;
        await repo.save(entry121);
        const entry1211 = new Entity();
        entry1211.column = "D";
        entry1211.row = 2;
        entry1211.parent = entry121;
        await repo.save(entry1211);
        // Remove entry11 and entry1211
        await repo.remove([entry11, entry1211]);
        let descendants = await repo.findDescendants(entry1);
        descendants.length.should.be.eql(3);
        descendants = await repo.findDescendants(entry12);
        descendants.length.should.be.eql(2);
    })));
});
describe("github issues > #7155 > tree relations", () => {
    let connections;
    before(async () => (connections = await (0, test_utils_1.createTestingConnections)({
        entities: [__dirname + "/entity/RelationEntities{.js,.ts}"],
        enabledDrivers: ["mysql", "postgres", "mssql"],
    })));
    beforeEach(() => (0, test_utils_1.reloadTestingDatabases)(connections));
    after(() => (0, test_utils_1.closeTestingConnections)(connections));
    it("(Closure) Validate relations", () => Promise.all(connections.map(async (connection) => {
        const repo = connection.getTreeRepository(RelationEntities_1.RelationClosure);
        const relationRepo = connection.getRepository(RelationEntities_1.Relation);
        const relation = new RelationEntities_1.Relation();
        await relationRepo.save(relation);
        const relationEntity = new RelationEntities_1.RelationClosure();
        relationEntity.relation = relation;
        relationEntity.otherRelation = new RelationEntities_1.OtherRelation();
        const result = await repo.save(relationEntity);
        result.should.exist;
    })));
    it("(Nested) Validate relations", () => Promise.all(connections.map(async (connection) => {
        const repo = connection.getTreeRepository(RelationEntities_1.RelationNested);
        const relationRepo = connection.getRepository(RelationEntities_1.Relation);
        const relation = new RelationEntities_1.Relation();
        await relationRepo.save(relation);
        const relationEntity = new RelationEntities_1.RelationNested();
        relationEntity.relation = relation;
        relationEntity.otherRelation = new RelationEntities_1.OtherRelation();
        const result = await repo.save(relationEntity);
        result.should.exist;
    })));
    it("(Materialized) Validate relations", () => Promise.all(connections.map(async (connection) => {
        const repo = connection.getTreeRepository(RelationEntities_1.RelationMaterialized);
        const relationRepo = connection.getRepository(RelationEntities_1.Relation);
        const relation = new RelationEntities_1.Relation();
        await relationRepo.save(relation);
        const relationEntity = new RelationEntities_1.RelationMaterialized();
        relationEntity.relation = relation;
        relationEntity.otherRelation = new RelationEntities_1.OtherRelation();
        const result = await repo.save(relationEntity);
        result.should.exist;
    })));
});
/**
 * HELPER FUNCTIONS
 */
function getNestedSetIds(repo, ids) {
    const escape = (alias) => repo.manager.connection.driver.escape(alias);
    const select = {
        left: `${repo.metadata.targetName}.${repo.metadata.nestedSetLeftColumn.propertyPath}`,
        right: `${repo.metadata.targetName}.${repo.metadata.nestedSetRightColumn.propertyPath}`,
    };
    const queryBuilder = repo.createQueryBuilder();
    if (ids.length > 0) {
        let setFirstSelect = true;
        Object.keys(ids[0]).forEach((key) => {
            key = escape(key);
            if (setFirstSelect) {
                queryBuilder.select(key);
                queryBuilder.orderBy(key);
                setFirstSelect = false;
            }
            else {
                queryBuilder.addSelect(key);
                queryBuilder.addOrderBy(key);
            }
        });
        Object.entries(select).forEach(([key, value]) => {
            queryBuilder.addSelect(value, key);
        });
        return queryBuilder
            .whereInIds(ids)
            .getRawMany()
            .then((results) => {
            const data = [];
            for (const result of results) {
                const entry = {};
                for (const key of Object.keys(result)) {
                    const value = result[key];
                    // CockroachDB returns numeric types as string
                    const parsedValue = parseInt(value);
                    entry[key] = isNaN(parsedValue) ? value : parsedValue;
                }
                data.push(entry);
            }
            return data;
        });
    }
    return Promise.resolve();
}
function isResultExpected(results, expectedResults) {
    return results.every((result, index) => {
        return (Object.keys(result).length ===
            Object.keys(expectedResults[index]).length &&
            Object.keys(result).every((key) => result[key] === expectedResults[index][key]));
    });
}
async function generateConnections() {
    const connections = await Promise.all([
        (0, test_utils_1.createTestingConnections)({
            entities: [__dirname + "/entity/Remaining*{.js,.ts}"],
            enabledDrivers: ["mysql", "postgres"],
        }),
        (0, test_utils_1.createTestingConnections)({
            entities: [__dirname + "/entity/SqlServer*{.js,.ts}"],
            enabledDrivers: ["mssql"],
        }),
    ]);
    let result = [];
    for (const connection of connections) {
        result = result.concat(connection);
    }
    return result;
}
function getEntity(connection, type) {
    if (connection.driver.options.type === "mssql") {
        return entityMap[type]["mssql"];
    }
    return entityMap[type]["other"];
}
const entityMap = {
    single_closure: {
        mssql: SqlServerTreeEntities_1.SqlServerSingleIdClosure,
        other: RemainingTreeEntities_1.SingleIdClosure,
    },
    single_nested: {
        mssql: SqlServerTreeEntities_1.SqlServerSingleIdNested,
        other: RemainingTreeEntities_1.SingleIdNested,
    },
    single_materialized: {
        mssql: SqlServerTreeEntities_1.SqlServerSingleIdMaterialized,
        other: RemainingTreeEntities_1.SingleIdMaterialized,
    },
    multi_nested: {
        mssql: SqlServerTreeEntities_1.SqlServerMultiIdNested,
        other: RemainingTreeEntities_1.MultiIdNested,
    },
    multi_materialized: {
        mssql: SqlServerTreeEntities_1.SqlServerMultiIdMaterialized,
        other: RemainingTreeEntities_1.MultiIdMaterialized,
    },
};
//# sourceMappingURL=issue-7155.js.map