"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Category = void 0;
const tslib_1 = require("tslib");
const Entity_1 = require("../../../../../../../src/decorator/entity/Entity");
const PrimaryGeneratedColumn_1 = require("../../../../../../../src/decorator/columns/PrimaryGeneratedColumn");
const Column_1 = require("../../../../../../../src/decorator/columns/Column");
const OneToMany_1 = require("../../../../../../../src/decorator/relations/OneToMany");
const PostCategory_1 = require("./PostCategory");
let Category = class Category {
};
tslib_1.__decorate([
    (0, PrimaryGeneratedColumn_1.PrimaryGeneratedColumn)(),
    tslib_1.__metadata("design:type", Number)
], Category.prototype, "id", void 0);
tslib_1.__decorate([
    (0, Column_1.Column)({ unique: true }),
    tslib_1.__metadata("design:type", String)
], Category.prototype, "name", void 0);
tslib_1.__decorate([
    (0, OneToMany_1.OneToMany)((type) => PostCategory_1.PostCategory, (postCategory) => postCategory.category),
    tslib_1.__metadata("design:type", Array)
], Category.prototype, "posts", void 0);
Category = tslib_1.__decorate([
    (0, Entity_1.Entity)()
], Category);
exports.Category = Category;
//# sourceMappingURL=Category.js.map