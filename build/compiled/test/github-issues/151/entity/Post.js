"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Post = void 0;
const tslib_1 = require("tslib");
const Entity_1 = require("../../../../src/decorator/entity/Entity");
const PrimaryGeneratedColumn_1 = require("../../../../src/decorator/columns/PrimaryGeneratedColumn");
const Column_1 = require("../../../../src/decorator/columns/Column");
const Category_1 = require("./Category");
const JoinColumn_1 = require("../../../../src/decorator/relations/JoinColumn");
const OneToOne_1 = require("../../../../src/decorator/relations/OneToOne");
const PostMetadata_1 = require("./PostMetadata");
let Post = class Post {
};
tslib_1.__decorate([
    (0, PrimaryGeneratedColumn_1.PrimaryGeneratedColumn)(),
    tslib_1.__metadata("design:type", Number)
], Post.prototype, "id", void 0);
tslib_1.__decorate([
    (0, Column_1.Column)(),
    tslib_1.__metadata("design:type", String)
], Post.prototype, "title", void 0);
tslib_1.__decorate([
    (0, OneToOne_1.OneToOne)((type) => Category_1.Category, { cascade: true }),
    (0, JoinColumn_1.JoinColumn)(),
    tslib_1.__metadata("design:type", Object)
], Post.prototype, "category", void 0);
tslib_1.__decorate([
    (0, OneToOne_1.OneToOne)((type) => PostMetadata_1.PostMetadata, (metadata) => metadata.post, {
        cascade: true,
    }),
    (0, JoinColumn_1.JoinColumn)(),
    tslib_1.__metadata("design:type", Object)
], Post.prototype, "metadata", void 0);
Post = tslib_1.__decorate([
    (0, Entity_1.Entity)()
], Post);
exports.Post = Post;
//# sourceMappingURL=Post.js.map