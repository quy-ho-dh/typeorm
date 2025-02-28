"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostInformation = void 0;
const tslib_1 = require("tslib");
const index_1 = require("../../../src/index");
const Post_1 = require("./Post");
let PostInformation = class PostInformation {
};
tslib_1.__decorate([
    (0, index_1.PrimaryGeneratedColumn)(),
    tslib_1.__metadata("design:type", Number)
], PostInformation.prototype, "id", void 0);
tslib_1.__decorate([
    (0, index_1.Column)(),
    tslib_1.__metadata("design:type", String)
], PostInformation.prototype, "text", void 0);
tslib_1.__decorate([
    (0, index_1.OneToOne)((type) => Post_1.Post, (post) => post.information, {
        cascade: ["update"],
    }),
    tslib_1.__metadata("design:type", Post_1.Post)
], PostInformation.prototype, "post", void 0);
PostInformation = tslib_1.__decorate([
    (0, index_1.Entity)("sample2_post_information")
], PostInformation);
exports.PostInformation = PostInformation;
//# sourceMappingURL=PostInformation.js.map