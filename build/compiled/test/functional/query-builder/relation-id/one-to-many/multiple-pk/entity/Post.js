"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Post = void 0;
const tslib_1 = require("tslib");
const Entity_1 = require("../../../../../../../src/decorator/entity/Entity");
const Column_1 = require("../../../../../../../src/decorator/columns/Column");
const PrimaryColumn_1 = require("../../../../../../../src/decorator/columns/PrimaryColumn");
const Category_1 = require("./Category");
const OneToMany_1 = require("../../../../../../../src/decorator/relations/OneToMany");
let Post = class Post {
};
tslib_1.__decorate([
    (0, PrimaryColumn_1.PrimaryColumn)(),
    tslib_1.__metadata("design:type", Number)
], Post.prototype, "id", void 0);
tslib_1.__decorate([
    (0, PrimaryColumn_1.PrimaryColumn)(),
    tslib_1.__metadata("design:type", Number)
], Post.prototype, "authorId", void 0);
tslib_1.__decorate([
    (0, Column_1.Column)(),
    tslib_1.__metadata("design:type", String)
], Post.prototype, "title", void 0);
tslib_1.__decorate([
    (0, OneToMany_1.OneToMany)((type) => Category_1.Category, (category) => category.post),
    tslib_1.__metadata("design:type", Array)
], Post.prototype, "categories", void 0);
Post = tslib_1.__decorate([
    (0, Entity_1.Entity)()
], Post);
exports.Post = Post;
//# sourceMappingURL=Post.js.map