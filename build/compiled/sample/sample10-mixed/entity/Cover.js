"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cover = void 0;
const tslib_1 = require("tslib");
const index_1 = require("../../../src/index");
const Post_1 = require("./Post");
let Cover = class Cover {
};
tslib_1.__decorate([
    (0, index_1.PrimaryGeneratedColumn)(),
    tslib_1.__metadata("design:type", Number)
], Cover.prototype, "id", void 0);
tslib_1.__decorate([
    (0, index_1.Column)(),
    tslib_1.__metadata("design:type", String)
], Cover.prototype, "url", void 0);
tslib_1.__decorate([
    (0, index_1.OneToMany)((type) => Post_1.Post, (post) => post.cover),
    tslib_1.__metadata("design:type", Array)
], Cover.prototype, "posts", void 0);
Cover = tslib_1.__decorate([
    (0, index_1.Entity)("sample10_cover")
], Cover);
exports.Cover = Cover;
//# sourceMappingURL=Cover.js.map