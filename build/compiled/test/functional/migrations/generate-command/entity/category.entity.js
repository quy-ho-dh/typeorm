"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Category = void 0;
const tslib_1 = require("tslib");
const PrimaryColumn_1 = require("../../../../../src/decorator/columns/PrimaryColumn");
const Entity_1 = require("../../../../../src/decorator/entity/Entity");
const BaseEntity_1 = require("../../../../../src/repository/BaseEntity");
const Column_1 = require("../../../../../src/decorator/columns/Column");
let Category = class Category extends BaseEntity_1.BaseEntity {
};
tslib_1.__decorate([
    (0, PrimaryColumn_1.PrimaryColumn)(),
    tslib_1.__metadata("design:type", Number)
], Category.prototype, "id", void 0);
tslib_1.__decorate([
    (0, Column_1.Column)(),
    tslib_1.__metadata("design:type", String)
], Category.prototype, "name", void 0);
Category = tslib_1.__decorate([
    (0, Entity_1.Entity)("category_test")
], Category);
exports.Category = Category;
//# sourceMappingURL=category.entity.js.map