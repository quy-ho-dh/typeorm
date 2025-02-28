"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostMetadata = void 0;
const tslib_1 = require("tslib");
const index_1 = require("../../../src/index");
const Post_1 = require("./Post");
let PostMetadata = class PostMetadata {
};
tslib_1.__decorate([
    (0, index_1.PrimaryGeneratedColumn)(),
    tslib_1.__metadata("design:type", Number)
], PostMetadata.prototype, "id", void 0);
tslib_1.__decorate([
    (0, index_1.Column)(),
    tslib_1.__metadata("design:type", String)
], PostMetadata.prototype, "description", void 0);
tslib_1.__decorate([
    (0, index_1.ManyToMany)((type) => Post_1.Post, (post) => post.metadatas),
    tslib_1.__metadata("design:type", Array)
], PostMetadata.prototype, "posts", void 0);
PostMetadata = tslib_1.__decorate([
    (0, index_1.Entity)("sample4_post_metadata")
], PostMetadata);
exports.PostMetadata = PostMetadata;
//# sourceMappingURL=PostMetadata.js.map