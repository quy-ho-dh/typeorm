"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("../../../utils/test-setup");
require("reflect-metadata");
const Category_1 = require("./entity/Category");
const test_utils_1 = require("../../../utils/test-utils");
const chai_1 = require("chai");
describe("github issues > #8443 QueryFailedError when tree entity with JoinColumn > nested-set", () => {
    let connections;
    before(async () => (connections = await (0, test_utils_1.createTestingConnections)({
        entities: [Category_1.Category],
    })));
    beforeEach(() => (0, test_utils_1.reloadTestingDatabases)(connections));
    after(() => (0, test_utils_1.closeTestingConnections)(connections));
    it("attach should work properly", () => Promise.all(connections.map(async (connection) => {
        const categoryRepository = connection.getTreeRepository(Category_1.Category);
        const a1 = new Category_1.Category();
        a1.name = "a1";
        await categoryRepository.save(a1);
        const a11 = new Category_1.Category();
        a11.name = "a11";
        a11.parentCategory = a1;
        await categoryRepository.save(a11);
        const a111 = new Category_1.Category();
        a111.name = "a111";
        a111.parentCategory = a11;
        await categoryRepository.save(a111);
        const a12 = new Category_1.Category();
        a12.name = "a12";
        a12.parentCategory = a1;
        await categoryRepository.save(a12);
        const rootCategories = await categoryRepository.findRoots();
        rootCategories.should.be.eql([
            {
                id: 1,
                name: "a1",
            },
        ]);
        const a11Parent = await categoryRepository.findAncestors(a11);
        a11Parent.length.should.be.equal(2);
        a11Parent.should.deep.include({ id: 1, name: "a1" });
        a11Parent.should.deep.include({ id: 2, name: "a11" });
        const a1Children = await categoryRepository.findDescendants(a1);
        a1Children.length.should.be.equal(4);
        a1Children.should.deep.include({ id: 1, name: "a1" });
        a1Children.should.deep.include({ id: 2, name: "a11" });
        a1Children.should.deep.include({ id: 3, name: "a111" });
        a1Children.should.deep.include({ id: 4, name: "a12" });
    })));
    it("categories should be attached via children and saved properly", () => Promise.all(connections.map(async (connection) => {
        const categoryRepository = connection.getTreeRepository(Category_1.Category);
        const a1 = new Category_1.Category();
        a1.name = "a1";
        await categoryRepository.save(a1);
        const a11 = new Category_1.Category();
        a11.name = "a11";
        const a12 = new Category_1.Category();
        a12.name = "a12";
        a1.childCategories = [a11, a12];
        await categoryRepository.save(a1);
        const rootCategories = await categoryRepository.findRoots();
        rootCategories.should.be.eql([
            {
                id: 1,
                name: "a1",
            },
        ]);
        const a11Parent = await categoryRepository.findAncestors(a11);
        a11Parent.length.should.be.equal(2);
        a11Parent.should.deep.include({ id: 1, name: "a1" });
        a11Parent.should.deep.include({ id: 2, name: "a11" });
        const a1Children = await categoryRepository.findDescendants(a1);
        a1Children.length.should.be.equal(3);
        a1Children.should.deep.include({ id: 1, name: "a1" });
        a1Children.should.deep.include({ id: 2, name: "a11" });
        a1Children.should.deep.include({ id: 3, name: "a12" });
    })));
    it("categories should be attached via children and saved properly", () => Promise.all(connections.map(async (connection) => {
        const categoryRepository = connection.getTreeRepository(Category_1.Category);
        const a1 = new Category_1.Category();
        a1.name = "a1";
        await categoryRepository.save(a1);
        const a11 = new Category_1.Category();
        a11.name = "a11";
        const a12 = new Category_1.Category();
        a12.name = "a12";
        a1.childCategories = [a11, a12];
        await categoryRepository.save(a1);
        const rootCategories = await categoryRepository.findRoots();
        rootCategories.should.be.eql([
            {
                id: 1,
                name: "a1",
            },
        ]);
        const a11Parent = await categoryRepository.findAncestors(a11);
        a11Parent.length.should.be.equal(2);
        a11Parent.should.deep.include({ id: 1, name: "a1" });
        a11Parent.should.deep.include({ id: 2, name: "a11" });
        const a1Children = await categoryRepository.findDescendants(a1);
        a1Children.length.should.be.equal(3);
        a1Children.should.deep.include({ id: 1, name: "a1" });
        a1Children.should.deep.include({ id: 2, name: "a11" });
        a1Children.should.deep.include({ id: 3, name: "a12" });
    })));
    it("categories should be attached via children and saved properly and everything must be saved in cascades", () => Promise.all(connections.map(async (connection) => {
        const categoryRepository = connection.getTreeRepository(Category_1.Category);
        const a1 = new Category_1.Category();
        a1.name = "a1";
        const a11 = new Category_1.Category();
        a11.name = "a11";
        const a12 = new Category_1.Category();
        a12.name = "a12";
        const a111 = new Category_1.Category();
        a111.name = "a111";
        const a112 = new Category_1.Category();
        a112.name = "a112";
        a1.childCategories = [a11, a12];
        a11.childCategories = [a111, a112];
        await categoryRepository.save(a1);
        const rootCategories = await categoryRepository.findRoots();
        rootCategories.should.be.eql([
            {
                id: 1,
                name: "a1",
            },
        ]);
        const a11Parent = await categoryRepository.findAncestors(a11);
        a11Parent.length.should.be.equal(2);
        a11Parent.should.deep.include({ id: 1, name: "a1" });
        a11Parent.should.deep.include({ id: 2, name: "a11" });
        const a1Children = await categoryRepository.findDescendants(a1);
        const a1ChildrenNames = a1Children.map((child) => child.name);
        a1ChildrenNames.length.should.be.equal(5);
        a1ChildrenNames.should.deep.include("a1");
        a1ChildrenNames.should.deep.include("a11");
        a1ChildrenNames.should.deep.include("a12");
        a1ChildrenNames.should.deep.include("a111");
        a1ChildrenNames.should.deep.include("a112");
    })));
    it("findTrees() tests > findTrees should load all category roots and attached children", () => Promise.all(connections.map(async (connection) => {
        const categoryRepository = connection.getTreeRepository(Category_1.Category);
        const a1 = new Category_1.Category();
        a1.name = "a1";
        const a11 = new Category_1.Category();
        a11.name = "a11";
        const a12 = new Category_1.Category();
        a12.name = "a12";
        const a111 = new Category_1.Category();
        a111.name = "a111";
        const a112 = new Category_1.Category();
        a112.name = "a112";
        a1.childCategories = [a11, a12];
        a11.childCategories = [a111, a112];
        await categoryRepository.save(a1);
        const categoriesTree = await categoryRepository.findTrees();
        // using sort because some drivers returns arrays in wrong order
        categoriesTree[0].childCategories.sort((a, b) => a.id - b.id);
        categoriesTree[0].childCategories[0].childCategories.sort((a, b) => a.id - b.id);
        categoriesTree.should.be.eql([
            {
                id: a1.id,
                name: "a1",
                childCategories: [
                    {
                        id: a11.id,
                        name: "a11",
                        childCategories: [
                            {
                                id: a111.id,
                                name: "a111",
                                childCategories: [],
                            },
                            {
                                id: a112.id,
                                name: "a112",
                                childCategories: [],
                            },
                        ],
                    },
                    {
                        id: a12.id,
                        name: "a12",
                        childCategories: [],
                    },
                ],
            },
        ]);
    })));
    it("findTrees() tests > findTrees should filter by depth if optionally provided", () => Promise.all(connections.map(async (connection) => {
        const categoryRepository = connection.getTreeRepository(Category_1.Category);
        const a1 = new Category_1.Category();
        a1.name = "a1";
        const a11 = new Category_1.Category();
        a11.name = "a11";
        const a12 = new Category_1.Category();
        a12.name = "a12";
        const a111 = new Category_1.Category();
        a111.name = "a111";
        const a112 = new Category_1.Category();
        a112.name = "a112";
        a1.childCategories = [a11, a12];
        a11.childCategories = [a111, a112];
        await categoryRepository.save(a1);
        const categoriesTree = await categoryRepository.findTrees();
        // using sort because some drivers returns arrays in wrong order
        categoriesTree[0].childCategories.sort((a, b) => a.id - b.id);
        categoriesTree[0].childCategories[0].childCategories.sort((a, b) => a.id - b.id);
        categoriesTree.should.be.eql([
            {
                id: a1.id,
                name: "a1",
                childCategories: [
                    {
                        id: a11.id,
                        name: "a11",
                        childCategories: [
                            {
                                id: a111.id,
                                name: "a111",
                                childCategories: [],
                            },
                            {
                                id: a112.id,
                                name: "a112",
                                childCategories: [],
                            },
                        ],
                    },
                    {
                        id: a12.id,
                        name: "a12",
                        childCategories: [],
                    },
                ],
            },
        ]);
        const categoriesTreeWithEmptyOptions = await categoryRepository.findTrees({});
        // using sort because some drivers returns arrays in wrong order
        categoriesTreeWithEmptyOptions[0].childCategories.sort((a, b) => a.id - b.id);
        categoriesTreeWithEmptyOptions[0].childCategories[0].childCategories.sort((a, b) => a.id - b.id);
        categoriesTreeWithEmptyOptions.should.be.eql([
            {
                id: a1.id,
                name: "a1",
                childCategories: [
                    {
                        id: a11.id,
                        name: "a11",
                        childCategories: [
                            {
                                id: a111.id,
                                name: "a111",
                                childCategories: [],
                            },
                            {
                                id: a112.id,
                                name: "a112",
                                childCategories: [],
                            },
                        ],
                    },
                    {
                        id: a12.id,
                        name: "a12",
                        childCategories: [],
                    },
                ],
            },
        ]);
        const categoriesTreeWithDepthZero = await categoryRepository.findTrees({ depth: 0 });
        categoriesTreeWithDepthZero.should.be.eql([
            {
                id: a1.id,
                name: "a1",
                childCategories: [],
            },
        ]);
        const categoriesTreeWithDepthOne = await categoryRepository.findTrees({ depth: 1 });
        // using sort because some drivers returns arrays in wrong order
        categoriesTreeWithDepthOne[0].childCategories.sort((a, b) => a.id - b.id);
        categoriesTreeWithDepthOne[0].childCategories[0].childCategories.sort((a, b) => a.id - b.id);
        categoriesTreeWithDepthOne.should.be.eql([
            {
                id: a1.id,
                name: "a1",
                childCategories: [
                    {
                        id: a11.id,
                        name: "a11",
                        childCategories: [],
                    },
                    {
                        id: a12.id,
                        name: "a12",
                        childCategories: [],
                    },
                ],
            },
        ]);
    })));
    it("findTrees() tests > findTrees should present a meaningful error message when used with multiple roots + nested sets", () => Promise.all(connections.map(async (connection) => {
        const categoryRepository = connection.getTreeRepository(Category_1.Category);
        const a1 = new Category_1.Category();
        a1.name = "a1";
        await categoryRepository.save(a1);
        const b1 = new Category_1.Category();
        b1.name = "b1";
        await (0, chai_1.expect)(categoryRepository.save(b1)).to.be.rejectedWith("Nested sets do not support multiple root entities.");
    })));
    it("findDescendantsTree() tests > findDescendantsTree should load all category descendents and nested children", () => Promise.all(connections.map(async (connection) => {
        const categoryRepository = connection.getTreeRepository(Category_1.Category);
        const a1 = new Category_1.Category();
        a1.name = "a1";
        const a11 = new Category_1.Category();
        a11.name = "a11";
        const a12 = new Category_1.Category();
        a12.name = "a12";
        const a111 = new Category_1.Category();
        a111.name = "a111";
        const a112 = new Category_1.Category();
        a112.name = "a112";
        a1.childCategories = [a11, a12];
        a11.childCategories = [a111, a112];
        await categoryRepository.save(a1);
        const categoriesTree = await categoryRepository.findDescendantsTree(a1);
        // using sort because some drivers returns arrays in wrong order
        categoriesTree.childCategories.sort((a, b) => a.id - b.id);
        categoriesTree.childCategories[0].childCategories.sort((a, b) => a.id - b.id);
        categoriesTree.should.be.eql({
            id: a1.id,
            name: "a1",
            childCategories: [
                {
                    id: a11.id,
                    name: "a11",
                    childCategories: [
                        {
                            id: a111.id,
                            name: "a111",
                            childCategories: [],
                        },
                        {
                            id: a112.id,
                            name: "a112",
                            childCategories: [],
                        },
                    ],
                },
                {
                    id: a12.id,
                    name: "a12",
                    childCategories: [],
                },
            ],
        });
    })));
    it("findDescendantsTree() tests > findDescendantsTree should filter by depth if optionally provided", () => Promise.all(connections.map(async (connection) => {
        const categoryRepository = connection.getTreeRepository(Category_1.Category);
        const a1 = new Category_1.Category();
        a1.name = "a1";
        const a11 = new Category_1.Category();
        a11.name = "a11";
        const a12 = new Category_1.Category();
        a12.name = "a12";
        const a111 = new Category_1.Category();
        a111.name = "a111";
        const a112 = new Category_1.Category();
        a112.name = "a112";
        a1.childCategories = [a11, a12];
        a11.childCategories = [a111, a112];
        await categoryRepository.save(a1);
        const categoriesTree = await categoryRepository.findDescendantsTree(a1);
        // using sort because some drivers returns arrays in wrong order
        categoriesTree.childCategories.sort((a, b) => a.id - b.id);
        categoriesTree.childCategories[0].childCategories.sort((a, b) => a.id - b.id);
        categoriesTree.should.be.eql({
            id: a1.id,
            name: "a1",
            childCategories: [
                {
                    id: a11.id,
                    name: "a11",
                    childCategories: [
                        {
                            id: a111.id,
                            name: "a111",
                            childCategories: [],
                        },
                        {
                            id: a112.id,
                            name: "a112",
                            childCategories: [],
                        },
                    ],
                },
                {
                    id: a12.id,
                    name: "a12",
                    childCategories: [],
                },
            ],
        });
        const categoriesTreeWithEmptyOptions = await categoryRepository.findDescendantsTree(a1, {});
        // using sort because some drivers returns arrays in wrong order
        categoriesTreeWithEmptyOptions.childCategories.sort((a, b) => a.id - b.id);
        categoriesTreeWithEmptyOptions.childCategories[0].childCategories.sort((a, b) => a.id - b.id);
        categoriesTreeWithEmptyOptions.should.be.eql({
            id: a1.id,
            name: "a1",
            childCategories: [
                {
                    id: a11.id,
                    name: "a11",
                    childCategories: [
                        {
                            id: a111.id,
                            name: "a111",
                            childCategories: [],
                        },
                        {
                            id: a112.id,
                            name: "a112",
                            childCategories: [],
                        },
                    ],
                },
                {
                    id: a12.id,
                    name: "a12",
                    childCategories: [],
                },
            ],
        });
        const categoriesTreeWithDepthZero = await categoryRepository.findDescendantsTree(a1, {
            depth: 0,
        });
        categoriesTreeWithDepthZero.should.be.eql({
            id: a1.id,
            name: "a1",
            childCategories: [],
        });
        const categoriesTreeWithDepthOne = await categoryRepository.findDescendantsTree(a1, {
            depth: 1,
        });
        // using sort because some drivers returns arrays in wrong order
        categoriesTreeWithDepthOne.childCategories.sort((a, b) => a.id - b.id);
        categoriesTreeWithDepthOne.should.be.eql({
            id: a1.id,
            name: "a1",
            childCategories: [
                {
                    id: a11.id,
                    name: "a11",
                    childCategories: [],
                },
                {
                    id: a12.id,
                    name: "a12",
                    childCategories: [],
                },
            ],
        });
    })));
});
//# sourceMappingURL=nested-set.js.map