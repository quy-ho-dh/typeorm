"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Post = void 0;
const tslib_1 = require("tslib");
const src_1 = require("../../../../../../src");
let Post = class Post {
};
tslib_1.__decorate([
    (0, src_1.PrimaryGeneratedColumn)(),
    tslib_1.__metadata("design:type", Number)
], Post.prototype, "id", void 0);
tslib_1.__decorate([
    (0, src_1.Column)(),
    tslib_1.__metadata("design:type", String)
], Post.prototype, "title", void 0);
tslib_1.__decorate([
    (0, src_1.Column)(),
    tslib_1.__metadata("design:type", Boolean)
], Post.prototype, "useTitle", void 0);
tslib_1.__decorate([
    (0, src_1.Column)(),
    tslib_1.__metadata("design:type", String)
], Post.prototype, "firstName", void 0);
tslib_1.__decorate([
    (0, src_1.Column)(),
    tslib_1.__metadata("design:type", String)
], Post.prototype, "lastName", void 0);
tslib_1.__decorate([
    (0, src_1.Column)({
        asExpression: `CONCAT("firstName", "lastName")`,
        length: 700,
        generatedType: "VIRTUAL",
    }),
    tslib_1.__metadata("design:type", String)
], Post.prototype, "virtualFullName", void 0);
tslib_1.__decorate([
    (0, src_1.Column)({
        asExpression: `"firstName" || ' ' || "lastName"`,
        length: 700,
    }),
    tslib_1.__metadata("design:type", String)
], Post.prototype, "name", void 0);
tslib_1.__decorate([
    (0, src_1.Column)({
        generatedType: "VIRTUAL",
        asExpression: `standard_hash(coalesce("firstName",'MD5'))`,
        type: "varchar",
        length: 255,
        nullable: true,
    }),
    tslib_1.__metadata("design:type", String)
], Post.prototype, "nameHash", void 0);
Post = tslib_1.__decorate([
    (0, src_1.Entity)()
], Post);
exports.Post = Post;
//# sourceMappingURL=Post.js.map