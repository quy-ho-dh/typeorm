"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Post = void 0;
const tslib_1 = require("tslib");
const Entity_1 = require("../../../../../src/decorator/entity/Entity");
const PrimaryGeneratedColumn_1 = require("../../../../../src/decorator/columns/PrimaryGeneratedColumn");
const Column_1 = require("../../../../../src/decorator/columns/Column");
const DeleteDateColumn_1 = require("../../../../../src/decorator/columns/DeleteDateColumn");
const src_1 = require("../../../../../src");
let Post = class Post extends src_1.BaseEntity {
};
tslib_1.__decorate([
    (0, PrimaryGeneratedColumn_1.PrimaryGeneratedColumn)(),
    tslib_1.__metadata("design:type", Number)
], Post.prototype, "id", void 0);
tslib_1.__decorate([
    (0, DeleteDateColumn_1.DeleteDateColumn)(),
    tslib_1.__metadata("design:type", Date)
], Post.prototype, "deletedAt", void 0);
tslib_1.__decorate([
    (0, Column_1.Column)(),
    tslib_1.__metadata("design:type", String)
], Post.prototype, "name", void 0);
Post = tslib_1.__decorate([
    (0, Entity_1.Entity)()
], Post);
exports.Post = Post;
//# sourceMappingURL=Post.js.map