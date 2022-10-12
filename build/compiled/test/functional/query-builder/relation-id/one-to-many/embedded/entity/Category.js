"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Category = void 0;
const tslib_1 = require("tslib");
const Entity_1 = require("../../../../../../../src/decorator/entity/Entity");
const Column_1 = require("../../../../../../../src/decorator/columns/Column");
const PrimaryGeneratedColumn_1 = require("../../../../../../../src/decorator/columns/PrimaryGeneratedColumn");
const Post_1 = require("./Post");
const ManyToOne_1 = require("../../../../../../../src/decorator/relations/ManyToOne");
const JoinColumn_1 = require("../../../../../../../src/decorator/relations/JoinColumn");
let Category = class Category {
};
tslib_1.__decorate([
    (0, PrimaryGeneratedColumn_1.PrimaryGeneratedColumn)(),
    tslib_1.__metadata("design:type", Number)
], Category.prototype, "id", void 0);
tslib_1.__decorate([
    (0, Column_1.Column)(),
    tslib_1.__metadata("design:type", String)
], Category.prototype, "name", void 0);
tslib_1.__decorate([
    (0, ManyToOne_1.ManyToOne)((type) => Post_1.Post, (post) => post.counters.categories),
    (0, JoinColumn_1.JoinColumn)(),
    tslib_1.__metadata("design:type", Array)
], Category.prototype, "posts", void 0);
Category = tslib_1.__decorate([
    (0, Entity_1.Entity)()
], Category);
exports.Category = Category;
//# sourceMappingURL=Category.js.map