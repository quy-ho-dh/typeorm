"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Post = void 0;
const tslib_1 = require("tslib");
const src_1 = require("../../../../src");
let Post = class Post {
};
tslib_1.__decorate([
    (0, src_1.PrimaryColumn)(),
    tslib_1.__metadata("design:type", Number)
], Post.prototype, "id", void 0);
tslib_1.__decorate([
    (0, src_1.Column)(),
    tslib_1.__metadata("design:type", String)
], Post.prototype, "name", void 0);
Post = tslib_1.__decorate([
    (0, src_1.Entity)({ withoutRowid: true })
], Post);
exports.Post = Post;
//# sourceMappingURL=Post.js.map