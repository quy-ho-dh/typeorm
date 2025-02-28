"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Category = void 0;
const tslib_1 = require("tslib");
const Entity_1 = require("../../../../src/decorator/entity/Entity");
const PrimaryGeneratedColumn_1 = require("../../../../src/decorator/columns/PrimaryGeneratedColumn");
const Post_1 = require("./Post");
const OneToMany_1 = require("../../../../src/decorator/relations/OneToMany");
const src_1 = require("../../../../src");
let Category = class Category {
};
tslib_1.__decorate([
    (0, PrimaryGeneratedColumn_1.PrimaryGeneratedColumn)(),
    tslib_1.__metadata("design:type", Number)
], Category.prototype, "id", void 0);
tslib_1.__decorate([
    (0, OneToMany_1.OneToMany)(() => Post_1.Post, (post) => post.category, {
        cascade: true,
        eager: true,
    }),
    tslib_1.__metadata("design:type", Array)
], Category.prototype, "posts", void 0);
tslib_1.__decorate([
    (0, src_1.DeleteDateColumn)(),
    tslib_1.__metadata("design:type", Date)
], Category.prototype, "deletedAt", void 0);
Category = tslib_1.__decorate([
    (0, Entity_1.Entity)()
], Category);
exports.Category = Category;
//# sourceMappingURL=Category.js.map