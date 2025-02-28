"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Post = void 0;
const tslib_1 = require("tslib");
const index_1 = require("../../../src/index");
const PrimaryColumn_1 = require("../../../src/decorator/columns/PrimaryColumn");
const Generated_1 = require("../../../src/decorator/Generated");
let Post = class Post {
};
tslib_1.__decorate([
    (0, PrimaryColumn_1.PrimaryColumn)(),
    (0, Generated_1.Generated)(),
    tslib_1.__metadata("design:type", Number)
], Post.prototype, "id", void 0);
tslib_1.__decorate([
    (0, index_1.Column)(),
    tslib_1.__metadata("design:type", String)
], Post.prototype, "title", void 0);
tslib_1.__decorate([
    (0, index_1.Column)(),
    tslib_1.__metadata("design:type", String)
], Post.prototype, "text", void 0);
tslib_1.__decorate([
    (0, index_1.Column)({ nullable: false }),
    tslib_1.__metadata("design:type", Number)
], Post.prototype, "likesCount", void 0);
Post = tslib_1.__decorate([
    (0, index_1.Entity)("sample01_post")
], Post);
exports.Post = Post;
//# sourceMappingURL=Post.js.map